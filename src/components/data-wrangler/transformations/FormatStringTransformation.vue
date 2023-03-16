<template>
  <TransformationPanel name="字符串格式化">
    <template #form>
      <el-form-item label="列名" required>
        <el-select v-model="op.srcColName" placeholder="单选">
          <el-option
            v-for="entry in stringColOptions"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" required>
        <el-select v-model="op.formatType" placeholder="单选">
          <el-option
            v-for="entry in stringFormatOptions"
            :key="entry.value"
            :label="entry.label"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="op.formatType === 'AddPrefix' ? '前缀' : '后缀'"
        v-if="op.formatType === 'AddPrefix' || op.formatType === 'AddSuffix'"
      >
        <el-input v-model="op.prefixOrSuffix" placeholder=""> </el-input>
      </el-form-item>
      <el-form-item label="结果列名">
        <el-input v-model="op.dstColName" placeholder="不填默认自动生成新的列名"> </el-input>
      </el-form-item>
    </template>

    <template #help>
      <p>
        将表中字符串的列中的值进行格式化。目前支持的操作有将某一列的值转换成全大写/全小写/单词首字母大写、为某一列的值添加前缀/后缀。
      </p>

      <p>只支持对于类型为string的列进行操作。</p>

      <ColumnNamingEntry />
    </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import { useTableAndOpStackStore } from '@/stores/table-store'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { FormatStringOp } from '@/ts/data-wrangler/transformation-operations'

import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import ColumnNamingEntry from '@/components/data-wrangler/ColumnNamingEntry.vue'
import type { ElementDropdownSuggestionItem } from '@/ts/data-wrangler/ui-data-structure'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new FormatStringOp())
const stringFormatOptions: ElementDropdownSuggestionItem[] = [
  {
    label: '转换成全大写 (UPPER_CASE)',
    value: 'UpperCase'
  },
  {
    label: '转换成全小写 (lower_case)',
    value: 'LowerCase'
  },
  {
    label: '转换成单词首字母大写 (First Letter Capitalize)',
    value: 'Capitalize'
  },
  {
    label: '添加前缀',
    value: 'AddPrefix'
  },
  {
    label: '添加后缀',
    value: 'AddSuffix'
  }
]

const stringColOptions: ElementDropdownSuggestionItem[] = tableAndOpStackStore.tableColSchemas
  .filter((col) => col.type === 'string')
  .map((col) => ({
    label: col.name,
    value: col.name
  }))
</script>

<style scoped></style>
