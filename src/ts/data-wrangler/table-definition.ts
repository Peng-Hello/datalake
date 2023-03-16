export class SparkStructFieldSchema {
  name: string
  type: string
  nullable: boolean
  metadata: any

  constructor(name: string, type: string, nullable: boolean, metadata: any) {
    this.name = name
    this.type = type
    this.nullable = nullable
    this.metadata = metadata
  }
}

/**
 * Definitions are extracted from Spark schema
 */
export class ColumnSchema extends SparkStructFieldSchema {
  constructor(name: string, type: string, nullable: boolean, metadata: any) {
    super(name, type, nullable, metadata)
  }
}

/**
 * Definitions are extracted from Spark schema
 */
export class SparkStructTypeSchema {
  constructor(type: string, fields: SparkStructFieldSchema[]) {
    this.type = type
    this.fields = fields
  }
  type: string
  fields: SparkStructFieldSchema[]
}

/**
 * Definitions are extracted from Spark schema
 */
export class TableSchema extends SparkStructTypeSchema {
  constructor(type: string, fields: ColumnSchema[]) {
    super(type, fields)
  }
}

export class TableWithSchema {
  tableSchema: TableSchema
  rows: any[] // parse from JSON string

  constructor(tableSchema: TableSchema, rows: any[]) {
    this.tableSchema = tableSchema
    this.rows = rows
  }
}

export class RawTableWithSchemaString {
  rows: string[]
  schemaString: string

  constructor(rows: string[], schemaString: string) {
    this.rows = rows
    this.schemaString = schemaString
  }
}

export function toTableWithSchema(rawTable: RawTableWithSchemaString) {
  const tableData = rawTable.rows.map((rowStr) => JSON.parse(rowStr))
  const schema: TableSchema = JSON.parse(rawTable.schemaString)
  return new TableWithSchema(schema, tableData)
}
