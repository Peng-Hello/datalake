<template>
  <el-alert v-if="tableAndOpStackStore.opStack.length > 1"
    >你已经导入了数据，重新导入数据会清除已经添加的数据处理步骤！</el-alert
  >
</template>

<script lang="ts" setup>
import { useTableAndOpStackStore } from '@/stores/table-store'

const tableAndOpStackStore = useTableAndOpStackStore()
</script>

<style scoped></style>
