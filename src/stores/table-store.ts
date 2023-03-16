import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'

import type { ColumnSchema } from '@/ts/data-wrangler/table-definition'
import { TableWithSchema, toTableWithSchema } from '@/ts/data-wrangler/table-definition'
import {
  errorMessage,
  findRootCause,
  infoMessage,
  successMessage,
  unexpectedErrorMessage
} from '@/ts/data-wrangler/common-utils-functions'
import axios, { type AxiosResponse } from 'axios'
import type { TransformOp } from '@/ts/data-wrangler/transformation-operations'
import { useTransformationPanelStore } from '@/stores/transformation-panel'
import { ScriptForm, ScriptResponse } from '@/ts/data-wrangler/form'
import type { ServerException } from '@/ts/data-wrangler/exception'
import type { ElementDropdownSuggestionItem } from '@/ts/data-wrangler/ui-data-structure'

/**
 * Convert the operations defined in opStack to Scala code.
 * <p>
 * Template is
 * <pre>
 *   val df0_ = {..}. // the first operation is "load the dataset"
 *   val df1_ = {
 *     val df = df1_ // local-scoped defined df
 *     ...
 *   }
 *   val df2_ = {
 *     val df = df2_
 *     ...
 *   }
 *   dfx_.toTableWithSchemaJson
 * </pre>
 *
 * For SQL parse check, `dfx_.toTableWithSchemaJson` can be omitted by setting
 * enforceLastReturnValueDataFrame: boolean = false
 *
 * @param opStack stack to convert
 * @param enforceLastReturnValueDataFrame the value of last statement is DataFrame
 */
export function opStackToScalaScript(
  opStack: TransformOp[],
  enforceLastReturnValueDataFrame: boolean = true
) {
  // the first operation should be "load the dataset"
  const scalaScripts: string[] = [`val df0_  = {${opStack[0].asScalaScript()}}`]

  let i = 1
  for (; i < opStack.length; i++) {
    const dfName = `df${i}_`
    const script = `val ${dfName}  = {
        val df = df${i - 1}_
        ${opStack[i].asScalaScript()}
    }
    `
    scalaScripts.push(script)
  }

  if (enforceLastReturnValueDataFrame) {
    scalaScripts.push(`df${i - 1}_.toTableWithSchemaJson`)
  }

  return scalaScripts.join('\n')
}

function submitScalaCode(opStack: TransformOp[]) {
  const form = new ScriptForm(opStackToScalaScript(opStack))
  console.log('script to submit', form.script)

  return axios
    .post<ScriptForm, AxiosResponse<ScriptResponse>>('/api/spark/script', form)
    .then((res) => {
      const rawTableWithSchemaString = res.data.result
      return toTableWithSchema(rawTableWithSchemaString)
    })
}

export const useTableAndOpStackStore = defineStore('stack', () => {
  const opStack: Ref<TransformOp[]> = ref([])
  const opRedoStack: Ref<TransformOp[]> = ref([])
  const tableData: Ref<any[]> = ref([])
  const tableColSchemas: Ref<ColumnSchema[]> = ref([])

  const updateTable = (table: TableWithSchema) => {
    tableData.value = table.rows
    tableColSchemas.value = table.tableSchema.fields
  }

  const submitToOpStack = async (op: TransformOp) => {
    opStack.value.push(op)
    opRedoStack.value = [] // clear redo history
    const table = await submitScalaCode(opStack.value) // preview result
    updateTable(table)
  }

  const loadData = async (op: TransformOp) => {
    infoMessage('正在加载数据。初次加载数据集时可能耗时稍长，请耐心等待。')
    opStack.value = []
    await submitToOpStack(op)
      .then(() => {
        successMessage('数据集加载完成！')
      })
      .catch(() => {
        errorMessage('数据集加载失败！')
        opStack.value = []
      })
  }

  /**
   * Withdraw the opToUndo from the top of opStack,
   * and add it to the top of opRedoStack
   */
  const undoSubmitToOpStack = (): Promise<TransformOp> => {
    if (opStack.value.length === 0) {
      // error: nothing to undo!
      unexpectedErrorMessage('OpStack is null')
      throw Error('Unexpected')
    }

    const opToUndo = opStack.value.pop() as TransformOp
    return submitScalaCode(opStack.value).then((table) => {
      opRedoStack.value.push(opToUndo)
      updateTable(table)
      return opToUndo
    })
  }

  const redoSubmitToOpStack = (): Promise<void> => {
    if (opRedoStack.value.length === 0) {
      // error: nothing to redo!
      unexpectedErrorMessage('RedoOpStack is null')
      throw Error('Unexpected')
    }

    const opToRedo = opRedoStack.value.pop() as TransformOp
    opStack.value.push(opToRedo)
    return submitScalaCode(opStack.value)
      .then((table) => {
        updateTable(table)
        const transformationStore = useTransformationPanelStore()
        transformationStore.currentOp = transformationStore.currentOp.cloneAndResetOp()
        return
      })
      .catch((exception) => {
        /* Display error message */
        const serverException: ServerException | undefined = exception.response.data.exception
        const rootCause = findRootCause(serverException).replace('\n', '<br>')
        const message = `<p>重新添加操作失败。原因：</p><p>${
          rootCause === '' ? exception : rootCause
        }</p>`
        errorMessage(message)

        /* Reset to previous status
         *
         * Since we need to reset status here, catch section must be executed here. */
        opStack.value.pop()
        opRedoStack.value.push(opToRedo)
      })
  }

  const tableColSchemaAsElSelectFormat = computed(() =>
    tableColSchemas.value.map(
      (colSchema): ElementDropdownSuggestionItem => ({
        label: colSchema.name,
        value: colSchema.name
      })
    )
  )

  const generateDefaultColName = () => {
    return `result_${opStack.value.length}_${tableColSchemas.value.length}`
  }

  return {
    opStack,
    opRedoStack,
    tableData,
    tableColSchemas,
    undoSubmitToOpStack,
    redoSubmitToOpStack,
    submitToOpStack,
    loadData,
    tableColSchemaAsElSelectFormat,
    generateDefaultColName
  }
})

export const undoOpAddToStackMonaco = async () => {
  await useTableAndOpStackStore()
    .undoSubmitToOpStack()
    .then((op) => {
      const transformationStore = useTransformationPanelStore()

      /* reset with previous op */
      transformationStore.resetFormWithOp(op)

      successMessage('已撤销上一步添加数据转换操作。')
    })
    .catch((exception) => {
      const serverException: ServerException | undefined = exception.response.data.exception
      const rootCause = findRootCause(serverException).replace('\n', '<br>')
      const message = `<p>撤销添加操作失败。原因：</p><p>${
        rootCause === '' ? exception : rootCause
      }</p>`
      errorMessage(message)
    })
}

export const redoOpAddToStackMonaco = async () => {
  useTableAndOpStackStore()
    .redoSubmitToOpStack()
    .then(() => {
      successMessage('已重做上一步添加数据转换操作。')
    })
}
