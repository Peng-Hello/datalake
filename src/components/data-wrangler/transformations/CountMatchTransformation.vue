<template>
  <TransformationPanel name="匹配某个值">
    <template #form>
      <el-form-item label="列名" required>
        <el-select v-model="op.srcColName" placeholder="单选">
          <el-option
            v-for="entry in tableAndOpStackStore.tableColSchemaAsElSelectFormat"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="正则表达式" required>
        <el-input v-model="op.regExpr" placeholder=""> </el-input>
      </el-form-item>

      <el-form-item label="结果列名">
        <el-input v-model="op.dstColName" placeholder="不可含有空格和特殊字符',;{}()\n\t='">
        </el-input>
      </el-form-item>
    </template>

    <template #help> todo </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import { useTableAndOpStackStore } from '@/stores/table-store'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { RegExCountMatchOp } from '@/ts/data-wrangler/transformation-operations'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new RegExCountMatchOp())
</script>

<style scoped></style>
