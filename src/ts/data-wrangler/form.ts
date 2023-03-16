import type { RawTableWithSchemaString } from '@/ts/data-wrangler/table-definition'

/**
 * Form and response definition for submitting code to Spark backend
 */
export class ScriptForm {
  script: string

  constructor(script: string) {
    this.script = script
  }
}

export class ScriptResponse {
  result: RawTableWithSchemaString

  constructor(result: RawTableWithSchemaString) {
    this.result = result
  }
}
