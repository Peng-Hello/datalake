<template>
  <p>
    <el-tag :type="props.tagType" size="small" effect="dark"> {{ props.tagContent }} </el-tag>
    <slot />
  </p>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tagType: 'info' | 'warning' | 'success' | 'danger' | ''
  tagContent: string
}>()
</script>

<style scoped></style>
