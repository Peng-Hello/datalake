<template>
  <div>
    <h2 v-if="name !== null && name !== undefined">{{ name }}</h2>

    <el-form label-width="20%" label-position="left" style="width: 80%">
      <slot name="form"></slot>
      <CommonTransformationPanelFormButtons @resetForm="$emit('resetForm')" />
    </el-form>

    <TransformationHelp>
      <slot name="help"></slot>
    </TransformationHelp>
  </div>
</template>

<script lang="ts" setup>
import TransformationHelp from '@/components/data-wrangler/TransformationHelp.vue'
import CommonTransformationPanelFormButtons from '@/components/data-wrangler/CommonTransformationPanelFormButtons.vue'

defineProps<{ name?: string }>()
</script>

<style scoped></style>
