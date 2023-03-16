<template>
  <div>
    <p v-if="props.hasLoadData">请在左侧选择一个数据处理方式。</p>
    <p v-else>请先选择<el-button>导入</el-button>操作导入数据。</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ hasLoadData: boolean }>()
</script>

<style scoped></style>
