<template>
  <TransformationPanel name="Scala代码" @resetForm="onTextClearNeeded()">
    <template #form>
      <MonacoEditor
        :is-support-df-as-shortcut="true"
        :is-editor-clear-needed="isEditorClearNeeded"
        syntax-check-type="scala"
        @text-change="onTextChange"
        @text-cleared="onTextCleared"
      />
    </template>

    <template #help>
      <p>以书写Scala代码的形式实现自定义数据处理流程。</p>

      <HelpTaggedEntry tag-content="示例" tag-type=""
        >使用Spark Scala代码可以实现一些用SQL语言表达会较为复杂的操作，也支持使用<a
          href="https://spark.apache.org/docs/latest/ml-guide.html"
          target="_blank"
          >Spark MLlib</a
        >对 数据集建立机器学习流水线。
      </HelpTaggedEntry>

      <pre>
          val df2 = df.withColumn("a", col("b") +12) // df是当前的数据表
                      .drop("c")
          val df3 = df2.withColumn("d", when(col("gender") === "M","Male")
                      .when(col("gender") === "F","Female")
                      .otherwise("Unknown"))
          df3.sort(col("e").desc) // 注意最后一行语句的“值”需要是DataFrame
        </pre
      >

      <HelpTaggedEntry tag-content="提示" tag-type="info"
        >用<code>df</code>获取当前数据表的DataFrame。</HelpTaggedEntry
      >
      <HelpTaggedEntry tag-content="提示" tag-type="info"
        >默认已经导入<code>org.apache.spark.SparkContext._</code>,
        <code>import spark.implicits._</code>, <code>import spark.sql</code>,
        <code>import org.apache.spark.sql.functions._</code></HelpTaggedEntry
      >
      <HelpTaggedEntry tag-content="注意" tag-type="danger">
        代码最后一行语句的值需要是DataFrame，否则无法添加到数据处理步骤中。
      </HelpTaggedEntry>

      <p>
        编辑器提供了一部分代码提示，但并未包含Spark Scala所支持的所有API。参考<a
          href="https://spark.apache.org/docs/latest/api/scala/org/apache/spark/index.html"
          target="_blank"
          >Spark Scala Doc</a
        >获取更详尽的API信息。
      </p>

      <ColumnNamingEntry />
    </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import HelpTaggedEntry from '@/components/data-wrangler/HelpTaggedEntry.vue'
import ColumnNamingEntry from '@/components/data-wrangler/ColumnNamingEntry.vue'
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { CustomScalaScriptOp } from '@/ts/data-wrangler/transformation-operations'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
const op: Ref<CustomScalaScriptOp> = resetAndGetRefFromTransformationPanelStore(
  new CustomScalaScriptOp()
)
const isEditorClearNeeded = ref(false)
const onTextChange = (newText: string) => {
  op.value.code = newText
}
const onTextClearNeeded = () => {
  isEditorClearNeeded.value = true
}
const onTextCleared = () => {
  isEditorClearNeeded.value = false
}
</script>

<style scoped></style>
