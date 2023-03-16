<template>
  <TransformationPanel name="删除列">
    <template #form>
      <el-form-item label="列名" required>
        <el-select v-model="op.colNames" multiple placeholder="可多选">
          <el-option
            v-for="entry in tableAndOpStackStore.tableColSchemaAsElSelectFormat"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>

    <template #help>
      <p>选择需要删除的列的名字（可多选），点击“添加”确定。</p>
    </template>
  </TransformationPanel>
</template>

<script setup lang="ts">
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { DropColumnOp } from '@/ts/data-wrangler/transformation-operations'
import { useTableAndOpStackStore } from '@/stores/table-store'

import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new DropColumnOp())
</script>

<style scoped></style>
