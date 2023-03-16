import { defineStore } from 'pinia'
import type { IMarkdownString, IRange, languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'

import { opStackToScalaScript, useTableAndOpStackStore } from '@/stores/table-store'
import axios, { type AxiosResponse } from 'axios'
import { debounce } from 'lodash'
import { CustomScalaScriptOp, CustomSqlParseOp } from '@/ts/data-wrangler/transformation-operations'
import type { ServerException } from '@/ts/data-wrangler/exception'
import { findRootCause } from '@/ts/data-wrangler/common-utils-functions'
import type { Ref } from 'vue'

export type MonacoFunctionDef = languages.CompletionItem

export interface RawMonacoFunctionDef {
  label: string
  documentation: string
  insertText: string
  detail: string
}

const initialRange = {
  startLineNumber: 1,
  startColumn: 1,
  endLineNumber: 1,
  endColumn: 1
}

/* Keywords are forked from Spark SQL syntax definition */
const sparkSqlReservedWords: languages.CompletionItem[] = [
  'ALL ',
  'ASC ',
  'CLUSTER BY ',
  'DESC ',
  'DISTINCT ',
  'DISTRIBUTE BY ',
  'EXCEPT ',
  'FROM ',
  'GROUP BY ',
  'HAVING ',
  'INTERSECT ',
  'LATERAL VIEW ',
  'LIMIT ',
  'LIMIT ALL',
  'NULLS FIRST ',
  'NULLS LAST ',
  'ORDER BY ',
  'SELECT ',
  'SORT BY ',
  'TRANSFORM ',
  'UNION ',
  'WHERE ',
  'WINDOW ',
  'WITH '
].map((word) => {
  return {
    label: word.trim(),
    kind: monaco.languages.CompletionItemKind.Keyword,
    detail: 'SQL Keyword',
    insertText: word,
    range: initialRange, // range needs to recompute
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.KeepWhitespace
  }
})

export const useMonacoCompletionStore = defineStore('monacoCompletion', () => {
  /* Currently, function completion entries are static (will not change by context and cursor location),
   * so we cache them. */
  const rawScalaFunctionCompletionList: MonacoFunctionDef[] = []
  const rawSqlFunctionCompletionList: MonacoFunctionDef[] = []

  /* Cache function completion information from server */
  const getRawScalaFunctionCompletionList = () => {
    return axios
      .get<any, AxiosResponse<RawMonacoFunctionDef[]>>('/api/code-snippet/monaco')
      .then((res) => {
        const suggestions = res.data.map((id) => ({
          label: id.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          description: id.documentation,
          documentation: { value: id.documentation } as IMarkdownString,
          insertText: id.insertText,
          detail: id.detail,
          range: initialRange,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }))
        rawScalaFunctionCompletionList.push(...suggestions)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const getRawSqlFunctionCompletionList = () => {
    return axios
      .get<any, AxiosResponse<RawMonacoFunctionDef[]>>('/api/code-snippet/monaco/sql')
      .then((res) => {
        const suggestions = res.data.map((id) => ({
          label: id.label,
          kind: monaco.languages.CompletionItemKind.Function,
          description: id.documentation,
          documentation: { value: id.documentation } as IMarkdownString,
          insertText: id.insertText,
          detail: id.detail,
          range: initialRange
        }))
        rawSqlFunctionCompletionList.push(...suggestions)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /* Create completion lists */
  /* SQL reserved words */
  const getSqlReservedWordsCompletionList = (range: IRange): MonacoFunctionDef[] => {
    return sparkSqlReservedWords.map((item) => ({
      label: item.label,
      kind: item.kind,
      detail: item.detail,
      insertText: item.insertText,
      range: range, // range needs to recompute
      insertTextRules: item.insertTextRules
    }))
  }

  const getSchemaCompletionList = (range: IRange): languages.CompletionItem[] => {
    /**
     * since the size of schema list is generally small,
     * there is no need to implement cache mechanism;
     */
    const tableStore = useTableAndOpStackStore()
    return tableStore.tableColSchemas.map((schema) => ({
      label: schema.name,
      kind: monaco.languages.CompletionItemKind.Variable,
      detail: 'Column',
      insertText: schema.name,
      range: range, // range needs to recompute
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }))
  }

  const getFullScalaCompletionList = async (range: IRange) => {
    const schemaSuggestions = getSchemaCompletionList(range)

    /* get and cache function completion list */
    if (rawScalaFunctionCompletionList.length === 0) {
      await getRawScalaFunctionCompletionList()
    }
    rawScalaFunctionCompletionList.forEach((func) => {
      func.range = range
    })
    return schemaSuggestions.concat(rawScalaFunctionCompletionList)
  }

  const getSqlFunctionCompletionList = async (range: IRange) => {
    /* get and cache function completion list */
    if (rawSqlFunctionCompletionList.length === 0) {
      await getRawSqlFunctionCompletionList()
    }
    return rawSqlFunctionCompletionList.map((func) => ({
      label: func.label,
      kind: func.kind,
      detail: func.detail,
      insertText: func.insertText,
      range: range, // range needs to recompute
      insertTextRules: func.insertTextRules
    }))
  }

  const getFullSqlCompletionList = async (range: IRange) => {
    const reservedWordsCompletionList = getSqlReservedWordsCompletionList(range)
    const schemaSuggestions = getSchemaCompletionList(range)
    const functionCompletionList = await getSqlFunctionCompletionList(range)

    return schemaSuggestions.concat(reservedWordsCompletionList).concat(functionCompletionList)
  }

  return {
    getFullCompletionList: getFullScalaCompletionList,
    getSchemaCompletionList,
    getFullSqlCompletionList,
    getSqlReservedWordsCompletionList,
    getSqlFunctionCompletionList
  }
})

export const sqlSyntaxCheck = debounce(
  (
    sqlText: string,
    syntaxCheckMessage: Ref<string>,
    hasSyntaxError: Ref<boolean>,
    isSupportDfAsShortcut: boolean
  ) => {
    if (sqlText === '') {
      syntaxCheckMessage.value = ''
      hasSyntaxError.value = false
      return
    }

    const sqlParseOp = new CustomSqlParseOp(sqlText, !isSupportDfAsShortcut)
    /**
     *  目前只有两种形式调用，一种是单独的SQL语句，一种是在opStack定义的处理步骤之上再新增一个SQL步骤
     */
    const opStack = isSupportDfAsShortcut
      ? [...useTableAndOpStackStore().opStack, sqlParseOp]
      : [sqlParseOp]

    axios
      .post('/api/spark/script', {
        script: opStackToScalaScript(opStack, false)
      })
      .then(() => {
        syntaxCheckMessage.value = ''
        hasSyntaxError.value = false
      })
      .catch((exception) => {
        const serverException: ServerException | undefined = exception.response.data.exception
        const rootCause = findRootCause(serverException).trim()

        syntaxCheckMessage.value = `${rootCause}`
        hasSyntaxError.value = true
      })
  },
  10
)

export const scalaSyntaxCheck = debounce(
  (
    scalaCode: string,
    syntaxCheckMessage: Ref<string>,
    hasSyntaxError: Ref<boolean>,
    isSupportDfAsShortcut: boolean
  ) => {
    if (scalaCode === '') {
      syntaxCheckMessage.value = ''
      hasSyntaxError.value = false
      return
    }
    const scalaParseOp = new CustomScalaScriptOp()
    scalaParseOp.code = scalaCode
    /**
     *  目前只有两种形式调用，一种是单独的SQL语句，一种是在opStack定义的处理步骤之上再新增一个Scala步骤
     */
    const opStack = isSupportDfAsShortcut
      ? [...useTableAndOpStackStore().opStack, scalaParseOp]
      : [scalaParseOp]

    axios
      .post('/api/spark/script/v2/syntax_check', {
        script: opStackToScalaScript(opStack)
      })
      .then(() => {
        syntaxCheckMessage.value = ''
        hasSyntaxError.value = false
      })
      .catch((exception) => {
        const serverException: ServerException | undefined = exception.response.data.exception

        let rootCause = findRootCause(serverException)
          .replace('reflective compilation has failed:', '')
          .trim()

        rootCause = rootCause
          .replace(
            new RegExp('value toTableWithSchemaJson is not a member of (\\w+)'),
            'value toTableWithSchemaJson is not a member of $1.（最后一行代码的计算值需要是DataFrame）'
          )
          .replace(new RegExp("but '}' found."), "but '}' found.（语法错误）")
          .replace('\n', '; ')

        syntaxCheckMessage.value = `${rootCause}`
        hasSyntaxError.value = true
      })
  },
  10
)
