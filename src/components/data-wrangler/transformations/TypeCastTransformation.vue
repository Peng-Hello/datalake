<template>
  <TransformationPanel name="转换列数据类型">
    <template #form>
      <el-form-item label="列名">
        <el-select v-model="op.srcColName" placeholder="单选">
          <el-option
            v-for="entry in tableAndOpStackStore.tableColSchemaAsElSelectFormat"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="转换为">
        <el-select v-model="op.castTo" placeholder="单选">
          <el-option
            v-for="entry in typeCastOptions"
            :key="entry.value"
            :label="entry.label"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="结果列名">
        <el-input v-model="op.dstColName" placeholder="不填默认自动生成新的列名"> </el-input>
      </el-form-item>
    </template>

    <template #help>
      <p>将某一列转换成另外一个数据类型的表示。</p>

      <HelpTaggedEntry tag-content="注意" tag-type="warning"
        >当选择了错误的转换数据类型时，Spark不会抛出错误， 结果列的值会变成空。</HelpTaggedEntry
      >

      <ColumnNamingEntry />
    </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import { useTableAndOpStackStore } from '@/stores/table-store'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { TypeCastOp } from '@/ts/data-wrangler/transformation-operations'

import HelpTaggedEntry from '@/components/data-wrangler/HelpTaggedEntry.vue'
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import ColumnNamingEntry from '@/components/data-wrangler/ColumnNamingEntry.vue'
import type { ElementDropdownSuggestionItem } from '@/ts/data-wrangler/ui-data-structure'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new TypeCastOp())
const typeCastOptions: ElementDropdownSuggestionItem[] = [
  { label: 'string', value: 'string' },
  { label: 'boolean', value: 'boolean' },
  { label: 'byte', value: 'byte' },
  { label: 'short', value: 'short' },
  { label: 'int', value: 'int' },
  { label: 'long', value: 'long' },
  { label: 'float', value: 'float' },
  { label: 'double', value: 'double' },
  { label: 'decimal', value: 'decimal' },
  { label: 'date', value: 'date' },
  { label: 'timestamp', value: 'timestamp' }
]
</script>

<style scoped></style>
