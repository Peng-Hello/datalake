<template>
  <TransformationPanel name="SQL代码" @resetForm="onTextClearNeeded()">
    <template #form>
      <MonacoEditor
        :is-support-df-as-shortcut="true"
        :is-editor-clear-needed="isEditorClearNeeded"
        syntax-check-type="sql"
        @text-change="onTextChange"
        @text-cleared="onTextCleared"
      />
    </template>

    <template #help>
      <p>通过SQL Select语句完成对于当前表格的筛选、排序、数据转换等操作。</p>

      <HelpTaggedEntry tag-content="提示" tag-type="info"
        >用<code>df</code>指定表名为当前表。
      </HelpTaggedEntry>

      <HelpTaggedEntry tag-content="注意" tag-type="danger"
        >SQL语句必须以"Select"或"SELECT"或"select"（大小写不敏感）开头， 暂不支持DDL语句（如ALTER
        DATABASE, DROP TABLE)、DML语句（如INSERT TABLE）、其他辅助语句（如ADD
        FILES）等。具体语法参考
        <a href="https://spark.apache.org/docs/latest/sql-ref-syntax.html" target="_blank"
          >Spark SQL语法文档</a
        >和
        <a href="https://spark.apache.org/docs/latest/api/sql/#map_filter" target="_blank"
          >Spark SQL函数文档</a
        >。
      </HelpTaggedEntry>

      <HelpTaggedEntry tag-content="示例" tag-type=""
        >使用Spark SQL代码可以实现更加复杂的数据处理流程。
      </HelpTaggedEntry>

      <pre>
          select a, b, c from df where a > 50
        </pre
      >
      <pre>
          select avg(d) from df
            where e > 100
            group by g
        </pre
      >

      <ColumnNamingEntry />
    </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import HelpTaggedEntry from '@/components/data-wrangler/HelpTaggedEntry.vue'
import ColumnNamingEntry from '@/components/data-wrangler/ColumnNamingEntry.vue'
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { CustomSqlScriptOp } from '@/ts/data-wrangler/transformation-operations'
import { type Ref, ref } from 'vue'

const op: Ref<CustomSqlScriptOp> = resetAndGetRefFromTransformationPanelStore(
  new CustomSqlScriptOp()
)
const isEditorClearNeeded = ref(false)
const onTextChange = (newText: string) => {
  op.value.sqlCode = newText
}
const onTextClearNeeded = () => {
  isEditorClearNeeded.value = true
}
const onTextCleared = () => {
  isEditorClearNeeded.value = false
}
</script>

<style scoped></style>
