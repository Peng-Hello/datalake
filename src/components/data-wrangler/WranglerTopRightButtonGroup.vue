<template>
  <span>
    <el-button-group>
      <el-button
        ><el-icon><Setting /></el-icon
      ></el-button>
      <el-button
        :disabled="tableAndOpStackStore.opStack.length === 0"
        :type="tableAndOpStackStore.opStack.length === 0 ? '' : 'primary'"
        ><el-icon><CircleCheck /></el-icon> 完成</el-button
      >
    </el-button-group>
  </span>
</template>

<script lang="ts" setup>
import { Setting, CircleCheck } from '@element-plus/icons-vue'
import { useTableAndOpStackStore } from '@/stores/table-store'

const tableAndOpStackStore = useTableAndOpStackStore()
</script>

<style scoped></style>
