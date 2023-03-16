import { useTableAndOpStackStore } from '@/stores/table-store'
import { successMessage, unexpectedErrorMessage } from '@/ts/data-wrangler/common-utils-functions'

/**
 * Check whether it is a valid name for column.
 *
 * A valid column name for delta table should not contain ' ' (space) and ',;{}()\n\t='.
 * @param name a name to be checked
 */
const isInvalidColName = (name: string) => {
  if (name === '') {
    /* For empty names, it's considered incomplete but still valid.
     * (dstColName may be empty but will be auto-generated.) */
    return false
  }

  return (
    name.includes(' ') ||
    name.includes(',') ||
    name.includes(';') ||
    name.includes('{') ||
    name.includes('}') ||
    name.includes('(') ||
    name.includes(')') ||
    name.includes('\n') ||
    name.includes('\t') ||
    name.includes('=')
  )
}

/**
 * This inheritance hierarchy assumes that all the transformation
 * can be represented in Spark Scala code.
 *
 * For operations that includes side effects, observer-notify mechanism
 * is recommended.
 *
 */
export abstract class TransformOp {
  title: string

  protected constructor(title: string) {
    this.title = title
  }

  abstract asScalaScript(): string

  /**
   * Create a new object from given TransformOp type, and
   * set to the initial state.
   */
  abstract cloneAndResetOp(): TransformOp

  /**
   * Descriptive summary for this op.
   *
   * This is useful when showing dialogs. By default, it is the same as the op's title.
   */
  asDescriptiveTitle() {
    return this.title
  }

  /**
   * Submit this operation to opStack.
   */
  submit() {
    const tableAndOpStackStore = useTableAndOpStackStore()
    return tableAndOpStackStore.submitToOpStack(this).then(() => {
      successMessage(`成功${this.asDescriptiveTitle()}。`)
    })
  }

  /**
   * Indicates that whether the necessary parameters for this operation
   * is complete or not. Useful for user interfaces to guide users complete the form.
   */
  abstract isNotComplete(): boolean
}

export class LoadTableFromScalaOp extends TransformOp {
  code: string

  constructor() {
    super('加载数据集(Scala)')
    this.code = ''
  }

  asScalaScript(): string {
    return this.code
  }

  isNotComplete(): boolean {
    return this.code === ''
  }

  cloneAndResetOp(): TransformOp {
    return new LoadTableFromScalaOp()
  }
}

export class LoadTableFromSqlOp extends TransformOp {
  sqlCode: string

  constructor() {
    super('加载数据集(SQL)')
    this.sqlCode = ''
  }

  asScalaScript(): string {
    return `spark.sql("${this.sqlCode}")`
  }

  isNotComplete(): boolean {
    return this.sqlCode === ''
  }

  cloneAndResetOp(): TransformOp {
    return new LoadTableFromSqlOp()
  }
}

export class DropColumnOp extends TransformOp {
  colNames: string[]

  constructor() {
    super('删除列')
    this.colNames = []
  }

  asScalaScript(): string {
    return `df.drop(${this.colNames.map((colName) => `"${colName}"`).join(',')})`
  }

  asDescriptiveTitle(): string {
    return `删除列${this.colNames.join(',')}`
  }

  isNotComplete(): boolean {
    return this.colNames.length === 0
  }

  cloneAndResetOp(): TransformOp {
    return new DropColumnOp()
  }
}

export class RenameColumnOp extends TransformOp {
  srcColName: string

  dstColName: string

  constructor() {
    super('重命名列')
    this.srcColName = ''
    this.dstColName = ''
  }

  asScalaScript(): string {
    return `df.withColumnRenamed("${this.srcColName}", "${this.dstColName}")`
  }

  asDescriptiveTitle(): string {
    return `重命名列${this.srcColName}为${this.dstColName}`
  }

  isNotComplete(): boolean {
    return (
      this.srcColName === '' ||
      this.dstColName === '' ||
      this.dstColName === this.srcColName ||
      isInvalidColName(this.dstColName)
    )
  }

  cloneAndResetOp(): TransformOp {
    return new RenameColumnOp()
  }
}

export class FormatStringOp extends TransformOp {
  srcColName: string
  dstColName: string
  formatType: 'Capitalize' | 'LowerCase' | 'UpperCase' | 'AddPrefix' | 'AddSuffix' | ''
  prefixOrSuffix: string

  constructor() {
    super('格式化字符串')
    this.srcColName = ''
    this.dstColName = ''
    this.formatType = ''
    this.prefixOrSuffix = ''
  }

  asScalaScript(): string {
    let scalaScript: string
    if (this.dstColName === '') {
      this.dstColName = useTableAndOpStackStore().generateDefaultColName()
    }

    switch (this.formatType) {
      case 'AddPrefix':
        scalaScript = `df.withColumn("${this.dstColName}", concat(lit("${this.prefixOrSuffix}") , col("${this.srcColName}")))`
        break
      case 'AddSuffix':
        scalaScript = `df.withColumn("${this.dstColName}",  concat(col("${this.srcColName}") , lit("${this.prefixOrSuffix}")))`
        break
      case 'Capitalize':
        scalaScript = `df.withColumn("${this.dstColName}",  initcap(col("${this.srcColName}")))`
        break
      case 'LowerCase':
        scalaScript = `df.withColumn("${this.dstColName}",  lower(col("${this.srcColName}")))`
        break
      case 'UpperCase':
        scalaScript = `df.withColumn("${this.dstColName}",  upper(col("${this.srcColName}")))`
        break
      case '':
        unexpectedErrorMessage("String format type should not be ''")
        throw Error("String format type should not be ''")
    }
    return scalaScript
  }

  cloneAndResetOp(): TransformOp {
    return new FormatStringOp()
  }

  isNotComplete(): boolean {
    return (
      this.srcColName === '' ||
      this.formatType === '' ||
      ((this.formatType === 'AddPrefix' || this.formatType === 'AddSuffix') &&
        this.prefixOrSuffix === '') || // no prefix or suffix is given
      isInvalidColName(this.dstColName)
    )
  }

  asDescriptiveTitle(): string {
    const operation = `将列${this.srcColName}`
    if (this.formatType === 'Capitalize') {
      return operation + '转换为单词首字母大写'
    } else if (this.formatType === 'LowerCase') {
      return operation + '转换为全小写'
    } else if (this.formatType === 'UpperCase') {
      return operation + '转换为全大写'
    } else if (this.formatType === 'AddSuffix') {
      return operation + `添加后缀"${this.prefixOrSuffix}"`
    } else if (this.formatType === 'AddPrefix') {
      return operation + `添加前缀"${this.prefixOrSuffix}"`
    }
    return operation + '?'
  }
}

export class TypeCastOp extends TransformOp {
  constructor() {
    super('类型转换')
    this.srcColName = ''
    this.dstColName = ''
    this.castTo = ''
  }

  srcColName: string
  dstColName: string
  castTo:
    | 'string'
    | 'boolean'
    | 'byte'
    | 'short'
    | 'int'
    | 'long'
    | 'float'
    | 'double'
    | 'decimal'
    | 'date'
    | 'timestamp'
    | ''

  asScalaScript(): string {
    if (this.dstColName === '') {
      this.dstColName = useTableAndOpStackStore().generateDefaultColName()
    }
    return `df.withColumn("${this.dstColName}", col("${this.srcColName}").cast("${this.castTo}"))`
  }

  cloneAndResetOp(): TransformOp {
    return new TypeCastOp()
  }

  isNotComplete(): boolean {
    return this.srcColName === '' || this.castTo === ''
  }
}

export class CustomScalaScriptOp extends TransformOp {
  code: string

  constructor() {
    super('设置自定义Scala代码')
    this.code = ''
  }

  asScalaScript(): string {
    return this.code
  }

  isNotComplete() {
    console.log('code', this.code)
    return this.code === ''
  }

  cloneAndResetOp(): TransformOp {
    return new CustomScalaScriptOp()
  }
}

export class CustomSqlScriptOp extends TransformOp {
  /**
   * SELECT statement
   */
  sqlCode: string

  constructor() {
    super('自定义SQL代码')
    this.sqlCode = ''
  }

  asScalaScript(): string {
    /**
     * We register df as temp view and drop it after this block.
     */
    return `df.createOrReplaceTempView("df")
    val result = spark.sql("""${this.sqlCode.replace(/\n/g, ' ').replace(/\t/g, ' ')}""")
    spark.catalog.dropTempView("df")
    result
    `
  }

  cloneAndResetOp(): TransformOp {
    return new CustomSqlScriptOp()
  }

  isNotComplete(): boolean {
    return (
      !this.sqlCode.toLocaleLowerCase().trim().startsWith('select') || // sqlScript must start with 'select'
      this.sqlCode.length <= 7
    )
  }
}

/**
 * Op for Sql Code Syntax check
 */
export class CustomSqlParseOp extends TransformOp {
  sqlCode: string
  isFirstLoadOp: boolean

  constructor(sqlScript: string, isFirstLoadOp: boolean = false) {
    super('自定义SQL代码检查')
    this.sqlCode = sqlScript
    this.isFirstLoadOp = isFirstLoadOp
  }

  asScalaScript(): string {
    if (this.isFirstLoadOp) {
      /* Since this is the first block, `df` should not be available as shortcut. */
      return `
      import org.springframework.web.server.ResponseStatusException
      import org.springframework.http.HttpStatus
      import org.apache.spark.sql.execution.ExplainMode
      
      def sqlValidation(sqlScript: String) = {
        try{
            spark.sql(sqlScript).queryExecution.explainString(ExplainMode.fromString("simple"))
        }catch {
          case e: Throwable => {
            throw new  ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Error parsing SQL", e)
          }
        }
      }
      sqlValidation("""${this.sqlCode}""")
    `
    } else {
      /* This op is just like usual op, only the fact that it doesn't execute it. */
      return `
      import org.springframework.web.server.ResponseStatusException
      import org.springframework.http.HttpStatus
      import org.apache.spark.sql.execution.ExplainMode
      
      df.createOrReplaceTempView("df")
      def sqlValidation(sqlScript: String) = {
        try{
            spark.sql(sqlScript).queryExecution.explainString(ExplainMode.fromString("simple"))
        }catch {
          case e: Throwable => {
            throw new  ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Error parsing SQL", e)
          }
        }
      }
      sqlValidation("""${this.sqlCode}""")
      spark.catalog.dropTempView("df")
    `
    }
  }

  cloneAndResetOp(): TransformOp {
    return new CustomSqlScriptOp()
  }

  isNotComplete(): boolean {
    return !this.sqlCode.toLocaleLowerCase().trim().startsWith('select') || this.sqlCode.length <= 7
  }
}

export class RegExCountMatchOp extends TransformOp {
  regExpr: string
  srcColName: string
  dstColName: string

  constructor() {
    super('正则表达式匹配')
    this.regExpr = ''
    this.srcColName = ''
    this.dstColName = ''
  }

  asScalaScript(): string {
    if (this.dstColName === '') {
      this.dstColName = useTableAndOpStackStore().generateDefaultColName()
    }
    return `val _regex = "${this.regExpr}"
      df.withColumn("${this.dstColName}",when(col("${this.srcColName}").rlike(_regex), 1).otherwise(0))
    `
  }

  cloneAndResetOp(): TransformOp {
    return new RegExCountMatchOp()
  }

  isNotComplete(): boolean {
    return this.srcColName === '' || this.regExpr === '' || isInvalidColName(this.dstColName)
  }
}

export class SplitColumnByDelimiterOp extends TransformOp {
  delimiter: string
  srcColName: string
  dstColName: string
  maxSplits: number

  constructor() {
    super('Split Columns')
    this.delimiter = ''
    this.srcColName = ''
    this.dstColName = ''
    this.maxSplits = 0
  }

  asScalaScript(): string {
    if (this.dstColName === '') {
      this.dstColName = useTableAndOpStackStore().generateDefaultColName()
    }
    const splitScript = `df.withColumn("${this.dstColName}", split(col("${this.srcColName}"), "${this.delimiter}"))`
    if (this.maxSplits === 0) {
      /* result will be an array column */
      return splitScript
    } else {
      /* result will be individual columns, the number of new columns equals to maxSplit */
      let takeElementScript = ''
      for (let i = 1; i <= this.maxSplits; i++) {
        takeElementScript += `.withColumn("${this.dstColName}_${i}", element_at($"${this.dstColName}", ${i}))`
      }
      takeElementScript += `.drop("${this.dstColName}")` // drop original column
      return splitScript + takeElementScript
    }
  }

  cloneAndResetOp(): TransformOp {
    return new RegExCountMatchOp()
  }

  isNotComplete(): boolean {
    return this.srcColName === '' || isInvalidColName(this.dstColName)
  }
}

export class MergeColumnOp extends TransformOp {
  srcColName1: string
  srcColName2: string
  dstColName: string
  prefix: string
  delimiter: string
  suffix: string

  constructor() {
    super('合并列')
    this.srcColName1 = ''
    this.srcColName2 = ''
    this.dstColName = ''
    this.prefix = ''
    this.delimiter = ''
    this.suffix = ''
  }

  asScalaScript(): string {
    if (this.dstColName === '') {
      this.dstColName = useTableAndOpStackStore().generateDefaultColName()
    }
    return `df.withColumn("${this.dstColName}", concat(
      lit("${this.prefix}"), 
      col("${this.srcColName1}"), 
      lit("${this.delimiter}"), 
      col("${this.srcColName2}"), 
      lit("${this.suffix}")))`
  }

  cloneAndResetOp(): TransformOp {
    return new MergeColumnOp()
  }

  isNotComplete(): boolean {
    return this.srcColName1 === '' || this.srcColName2 === '' || isInvalidColName(this.dstColName)
  }
}

export const exampleLoadOp = () => {
  const op = new LoadTableFromSqlOp()
  op.sqlCode = 'select * from delta.`E:/Downloads/deltacsv`'
  return op
}

// export const exampleLoadOp = new LoadTableFromSqlOp("select * from delta.`E:/Downloads/deltaphonecsv` limit 200");
