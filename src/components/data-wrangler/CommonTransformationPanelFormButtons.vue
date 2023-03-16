<template>
  <el-form-item>
    <el-button
      type="primary"
      @click="submitForm"
      :disabled="
        tableAndOpStackStore.tableColSchemas.length === 0 ||
        transformationPanelStore.currentOp.isNotComplete() ||
        isSubmitting
      "
    >
      <el-icon>
        <CirclePlus />
      </el-icon>
      {{ isSubmitting ? '提交中' : '确定' }}
    </el-button>
    <el-button @click="resetForm" type="danger" plain>
      <el-icon>
        <RefreshLeft />
      </el-icon>
      重置选项</el-button
    >
  </el-form-item>
</template>

<script lang="ts" setup>
import { useTransformationPanelStore } from '@/stores/transformation-panel'
import { CirclePlus, RefreshLeft } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { resetButtonState } from '@/ts/data-wrangler/common-utils-functions'
import { useTableAndOpStackStore } from '@/stores/table-store'

const tableAndOpStackStore = useTableAndOpStackStore()
const transformationPanelStore = useTransformationPanelStore()
const isSubmitting = ref(false)
const submitForm = async (event: Event) => {
  isSubmitting.value = true
  await transformationPanelStore.submit().finally(() => {
    resetButtonState(event)

    emits('resetForm')
    isSubmitting.value = false

  })
}

const emits = defineEmits<{ (e: 'resetForm'): void }>()

const resetForm = (event: Event) => {
  transformationPanelStore.resetFormWithEmptyValue()
  resetButtonState(event)

  /**
   * Notify parent component if extra side effect is needed to reset status
   */
  emits('resetForm')
}
</script>

<style scoped></style>
