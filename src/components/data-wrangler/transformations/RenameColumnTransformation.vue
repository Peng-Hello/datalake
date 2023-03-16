<template>
  <TransformationPanel name="重命名列">
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
      <el-form-item label="重命名为">
        <el-input v-model="op.dstColName" placeholder="不可含有空格和特殊字符',;{}()\n\t='">
        </el-input>
      </el-form-item>
    </template>

    <template #help>
      <p>将表中某一列重命名。</p>

      <ColumnNamingEntry />

      <HelpTaggedEntry tag-content="注意" tag-type="warning"
        >不建议重命名为表中已有的列相同的名字，这可能会带来数据覆盖等问题。如果错误操作，请按<el-button
          size="small"
          type="primary"
          plain
          >上一步</el-button
        >撤销此操作。</HelpTaggedEntry
      >
    </template>
  </TransformationPanel>
</template>

<script setup lang="ts">
import { useTableAndOpStackStore } from '@/stores/table-store'
import { useTransformationPanelStore } from '@/stores/transformation-panel'
import { RenameColumnOp } from '@/ts/data-wrangler/transformation-operations'
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import HelpTaggedEntry from '@/components/data-wrangler/HelpTaggedEntry.vue'
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import ColumnNamingEntry from '@/components/data-wrangler/ColumnNamingEntry.vue'

const tableAndOpStackStore = useTableAndOpStackStore()

const transformationPanelStore = useTransformationPanelStore()
transformationPanelStore.currentOp = new RenameColumnOp()

const { currentOp } = storeToRefs(transformationPanelStore)
const op = currentOp as Ref<RenameColumnOp>
</script>

<style scoped></style>
