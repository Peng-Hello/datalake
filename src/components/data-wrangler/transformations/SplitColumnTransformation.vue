<template>
  <TransformationPanel name="分割列">
    <template #form>
      <el-form-item label="列名" required>
        <el-select v-model="op.srcColName" placeholder="单选">
          <el-option
            v-for="entry in stringColumns"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分界符" required>
        <el-input v-model="op.delimiter" placeholder=""> </el-input>
      </el-form-item>

      <el-form-item label="结果列名">
        <el-input v-model="op.dstColName" placeholder="不可含有空格和特殊字符',;{}()\n\t='">
        </el-input>
      </el-form-item>

      <el-form-item label="结果列数量" required>
        <el-input v-model="op.maxSplits" placeholder="默认为0，不分割成单独的列"> </el-input>
      </el-form-item>
    </template>

    <template #help> </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import { useTableAndOpStackStore } from '@/stores/table-store'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { SplitColumnByDelimiterOp } from '@/ts/data-wrangler/transformation-operations'
import type { ElementDropdownSuggestionItem } from '@/ts/data-wrangler/ui-data-structure'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new SplitColumnByDelimiterOp())
const stringColumns: ElementDropdownSuggestionItem[] = tableAndOpStackStore.tableColSchemas
  .filter((colSchema) => colSchema.type === 'string')
  .map((colSchema) => ({
    label: colSchema.name,
    value: colSchema.name
  }))
</script>

<style scoped></style>
