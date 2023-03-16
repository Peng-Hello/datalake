<!-- This component defines a Monaco Editor with automatic syntax check -->

<template>
  <div style="padding: 2% 5%">
    <el-space direction="vertical">
      <div
        id="editor"
        ref="monacoEditorDiv"
        :style="{
          height:
            prop.editorHeight === null || prop.editorHeight === undefined
              ? '35vh'
              : prop.editorHeight,
          width:
            prop.editorWidth === null || prop.editorWidth === undefined ? '23vw' : prop.editorWidth
        }"
      ></div>
      <el-alert
        :type="hasSyntaxError ? 'error' : 'success'"
        :closable="false"
        show-icon
        style="width: 60vw"
      >
        <template #title>
          <pre>{{ syntaxCheckMessage }}</pre>
        </template>
      </el-alert>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import type { editor, languages, Position } from 'monaco-editor'
import * as monaco from 'monaco-editor'

import {
  scalaSyntaxCheck,
  sqlSyntaxCheck,
  useMonacoCompletionStore
} from '@/stores/monaco-editor-completion-provider'

const initialText = ''
const prop = defineProps<{
  editorHeight?: string
  editorWidth?: string
  syntaxCheckType: 'sql' | 'scala'

  /* Is df available as alias for current dataset? It should be set to false when there is no dataset loaded. */
  isSupportDfAsShortcut: boolean

  /* A flag to notify editor to clear the contents. It should be reset to false after textCleared event */
  isEditorClearNeeded: boolean
}>()
const emits = defineEmits<{
  (e: 'textChange', newText: string): void /* Text change event */
  (e: 'textCleared'): void /* Text has been cleared event */
}>()

const monacoEditorDiv: Ref<HTMLDivElement | null> = ref(null)
let monacoEditor: editor.IStandaloneCodeEditor | null = null
let completionProvider: monaco.IDisposable | null = null

const monacoCompletionStore = useMonacoCompletionStore()
const textValue = ref('')
const syntaxCheckMessage = ref('')
const hasSyntaxError = ref(false)

const isClearNeeded = computed(() => {
  return prop.isEditorClearNeeded
})
watch(isClearNeeded, (flag: boolean) => {
  if (flag) {
    monacoEditor?.setValue('')

    /* notify parent component to clear flag */
    emits('textCleared')
  }
})
const syntaxCheckFunction = prop.syntaxCheckType === 'sql' ? sqlSyntaxCheck : scalaSyntaxCheck

onMounted(() => {
  if (monacoEditorDiv.value != null) {
    /* Create monaco editor and register corresponding completion provider */
    if (prop.syntaxCheckType === 'sql') {
      monacoEditor = monaco.editor.create(monacoEditorDiv.value, {
        value: initialText,
        language: 'sql',
        wrappingStrategy: 'advanced',
        minimap: { enabled: false },
        automaticLayout: true
      })

      completionProvider = monaco.languages.registerCompletionItemProvider('sql', {
        async provideCompletionItems(
          model: editor.ITextModel,
          position: Position
        ): Promise<languages.CompletionList | null | undefined> {
          const wordBeforePosition = model.getWordUntilPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1
          })
          const wordUntilPosition = model.getWordUntilPosition(position)

          if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
            const range = {
              startLineNumber: position.lineNumber,
              startColumn: wordUntilPosition.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: wordUntilPosition.endColumn - 1
            }
            const suggestions = await monacoCompletionStore.getFullSqlCompletionList(range)

            return { suggestions: suggestions }
          }
        }
      })
    } else {
      monacoEditor = monaco.editor.create(monacoEditorDiv.value, {
        value: '',
        language: 'scala',
        wrappingStrategy: 'advanced',
        minimap: { enabled: false },
        automaticLayout: true
      })

      completionProvider = monaco.languages.registerCompletionItemProvider('scala', {
        async provideCompletionItems(
          model: editor.ITextModel,
          position: Position
        ): Promise<languages.CompletionList | null | undefined> {
          const wordBeforePosition = model.getWordUntilPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1
          })
          const wordUntilPosition = model.getWordUntilPosition(position)

          if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
            const range = {
              startLineNumber: position.lineNumber,
              startColumn: wordUntilPosition.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: wordUntilPosition.endColumn - 1
            }
            const suggestions = await monacoCompletionStore.getFullCompletionList(range)
            return { suggestions: suggestions }
          }
        }
      })
    }

    monacoEditor.getModel()?.onDidChangeContent(() => {
      /**
       * This is a unidirectional synchronization from internal state of monaco editor
       * to op.
       *
       * In case we need to sync the state from op to monaco editor, use
       * watch the flag mechanism to achieve this.
       */
      const value = monacoEditor?.getValue()
      if (value !== undefined) {
        textValue.value = value

        /* Emit new text to parent component */
        emits('textChange', value)
      }
    })

    /* Syntax check every time the focus is changed */
    monacoEditor.onDidFocusEditorWidget(() => {
      syntaxCheckFunction(
        textValue.value,
        syntaxCheckMessage,
        hasSyntaxError,
        prop.isSupportDfAsShortcut
      )
    })

    monacoEditor.onDidBlurEditorWidget(() => {
      syntaxCheckFunction(
        textValue.value,
        syntaxCheckMessage,
        hasSyntaxError,
        prop.isSupportDfAsShortcut
      )
    })
  }
})

onBeforeUnmount(() => {
  /** Dispose completion information to avoid displaying duplicate
   * completion entries when user enter this transformation panel next time */
  completionProvider?.dispose()
  monacoEditor?.dispose()
})
</script>

<style scoped>
pre {
  width: 99%;
  overflow: auto;
  padding: 0;
  margin: 0;
}
</style>
