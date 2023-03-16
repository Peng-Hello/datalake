<template>
  <el-dialog :title="title" style="width: 40%" v-model="internalOpenDialogFlag" :destroy-on-close="true">
    <ResetTableStepWarningMessage />
    <el-row style="justify-content: center">
      <MonacoEditor
        :is-support-df-as-shortcut="false"
        :syntax-check-type="props.codeType"
        :is-editor-clear-needed="isEditorClearNeeded"
        @text-change="onTextChange"
        @text-cleared="onTextCleared"
      />
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClearButtonClicked()">清除</el-button>
        <el-button @click="$emit('cancel')">Cancel</el-button>
        <el-button type="primary" @click="onConfirmButtonClicked"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const isEditorClearNeeded = ref(false)
const props = defineProps<{
  isShowLoadTableDialog: boolean
  codeType: 'sql' | 'scala'
}>()
const internalOpenDialogFlag = ref(props.isShowLoadTableDialog)
const isShowDialog = computed(() => props.isShowLoadTableDialog)
watch(isShowDialog, (flag: boolean) => {
  console.log('flag changed')
  internalOpenDialogFlag.value = flag
})

const emits = defineEmits<{ (e: 'cancel'): void; (e: 'confirm', code: string): void }>()

const code = ref('')

const title = props.codeType === 'sql' ? 'SQL代码查询数据表' : 'Scala代码查询数据表'
const onTextChange = (newText: string) => {
  code.value = newText
}

const onTextCleared = () => {
  code.value = ''
  isEditorClearNeeded.value = false
}

const onClearButtonClicked = () => {
  isEditorClearNeeded.value = true
}
const onConfirmButtonClicked = () => {
  emits('confirm', code.value)
}
</script>

<style scoped></style>
