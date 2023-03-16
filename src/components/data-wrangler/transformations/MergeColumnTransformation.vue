<template>
  <TransformationPanel name="合并两个列">
    <template #form>
      <el-form-item label="列名1" required>
        <el-select v-model="op.srcColName1" placeholder="单选">
          <el-option
            v-for="entry in tableAndOpStackStore.tableColSchemaAsElSelectFormat"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="列名2" required>
        <el-select v-model="op.srcColName2" placeholder="单选">
          <el-option
            v-for="entry in tableAndOpStackStore.tableColSchemaAsElSelectFormat"
            :key="entry.value"
            :label="entry.value"
            :value="entry.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="前缀">
        <el-input v-model="op.prefix" placeholder=""> </el-input>
      </el-form-item>

      <el-form-item label="连接符">
        <el-input v-model="op.delimiter" placeholder=""> </el-input>
      </el-form-item>

      <el-form-item label="后缀">
        <el-input v-model="op.suffix" placeholder=""> </el-input>
      </el-form-item>

      <el-form-item label="结果列名">
        <el-input v-model="op.dstColName" placeholder="不可含有空格和特殊字符',;{}()\n\t='">
        </el-input>
      </el-form-item>
    </template>

    <template #help> </template>
  </TransformationPanel>
</template>

<script lang="ts" setup>
import TransformationPanel from '@/components/data-wrangler/TransformationPanel.vue'
import { useTableAndOpStackStore } from '@/stores/table-store'
import { resetAndGetRefFromTransformationPanelStore } from '@/stores/transformation-panel'
import { MergeColumnOp } from '@/ts/data-wrangler/transformation-operations'

const tableAndOpStackStore = useTableAndOpStackStore()
const op = resetAndGetRefFromTransformationPanelStore(new MergeColumnOp())
</script>

<style scoped></style>
