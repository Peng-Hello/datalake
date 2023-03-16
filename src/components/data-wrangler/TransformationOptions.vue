<template>
  <div>
    <el-button-group>
      <el-tooltip content="撤销上一步">
        <el-button
          type="primary"
          :disabled="tableAndOpStore.opStack.length <= 1"
          @click="undoOpAddToStackMonaco()"
          text
          size="small"
        >
          <img alt="Vue logo" class="logo" :src="'/src/assets/Undo.svg'" width="13" height="13" />
        </el-button>
      </el-tooltip>

      <el-tooltip content="重做">
        <el-button
          type="primary"
          :disabled="tableAndOpStore.opRedoStack.length === 0"
          @click="redoOpAddToStackMonaco()"
          text
          size="small"
        >
          <img alt="Vue logo" class="logo" :src="'/src/assets/Redo.svg'" width="13" height="13" />
        </el-button>
      </el-tooltip>
    </el-button-group>
    <span v-for="group in transformationSuggestionList" :key="group.label">
      |

      <el-button-group>
        <el-tooltip
          v-for="item in group.options"
          placement="top-start"
          :key="item.value"
          effect="dark"
          :content="item.label"
        >
          <el-button
            :value="item.value"
            @click="onTransformationButtonClick($event, item.value)"
            :type="
              transformationPanelStore.currentTransformationPanel === item.value ? 'primary' : ''
            "
            text
          >
            <img
              alt="Vue logo"
              class="logo"
              :src="'/src/assets/' + item.icon + '.svg'"
              width="13"
              height="13"
            />
          </el-button>
        </el-tooltip>
      </el-button-group>
    </span>
  </div>
</template>

<script lang="ts" setup>
import {
  transformationSuggestionList,
  useTransformationPanelStore
} from '@/stores/transformation-panel'

import { resetButtonState } from '@/ts/data-wrangler/common-utils-functions'
import {
  redoOpAddToStackMonaco,
  undoOpAddToStackMonaco,
  useTableAndOpStackStore
} from '@/stores/table-store'

const tableAndOpStore = useTableAndOpStackStore()
const transformationPanelStore = useTransformationPanelStore()

const onTransformationButtonClick = (event: Event, panel: string) => {
  console.log(panel)
  transformationPanelStore.currentTransformationPanel = panel
  transformationPanelStore.currentTabName = 'stepConfig'
  resetButtonState(event)
}
</script>

<style scoped></style>
