<template>
  <div id="main-container">
    <!-- Dialogs   -->
    <el-dialog
      v-model="isShowLoadTableDialogFromFilePath"
      title="选择数据湖中的表路径"
      style="width: 40%"
    >
      <ResetTableStepWarningMessage />
      <el-form>
        <el-form-item label="路径" style="width: 75%" required>
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowLoadTableDialogFromFilePath = false">Cancel</el-button>

          <el-button type="primary" @click="isShowLoadTableDialogFromFilePath = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <SelectDatasetDialog
      code-type="sql"
      :is-show-load-table-dialog="isShowLoadTableDialogFromSql"
      @cancel="isShowLoadTableDialogFromSql = false"
      @confirm="onConfirmLoadTableFromSql"
    />

    <SelectDatasetDialog
      code-type="scala"
      :is-show-load-table-dialog="isShowLoadTableDialogFromScala"
      @cancel="isShowLoadTableDialogFromScala = false"
      @confirm="onConfirmLoadTableFromScala"
    />

    <!---------- Body of contents ------------>
    <el-container style="height: 85vh">
      <!-- Header     -->
      <el-header>
        <el-row style="align-items: center">
          <el-col :span="3"><b>Data Wrangler</b></el-col>
          <el-col :span="18">
            <el-dropdown size="large" v-if="tableAndOpStore.opStack.length === 0 || isLoadingData">
              <!-- Dropdown menu when table is empty -->
              <el-button type="primary" @click="isShowLoadTableDialogFromFilePath = true">
                <el-icon>
                  <DocumentAdd />
                </el-icon>
                {{ isLoadingData ? '加载中' : '加载数据集' }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="isShowLoadTableDialogFromFilePath = true"
                    >选择数据表路径…
                  </el-dropdown-item>
                  <el-dropdown-item @click="isShowLoadTableDialogFromSql = true"
                    >以SQL代码加载…
                  </el-dropdown-item>
                  <el-dropdown-item @click="isShowLoadTableDialogFromScala = true"
                    >以Scala代码加载…
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-dropdown split-button size="large" v-else>
              <el-icon>
                <DocumentAdd />
              </el-icon>
              {{ getCurrentFileNameTitleStr() }}
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="isShowLoadTableDialogFromFilePath = true"
                    >选择另一个表路径...
                  </el-dropdown-item>
                  <el-dropdown-item @click="isShowLoadTableDialogFromSql = true"
                    >以SQL代码加载另一个表
                  </el-dropdown-item>
                  <el-dropdown-item @click="isShowLoadTableDialogFromScala = true"
                    >以Scala代码加载另一个表
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>

          <el-col :span="3">
            <WranglerTopRightButtonGroup />
          </el-col>
        </el-row>

        <!--  Transformation Toolbar      -->
        <el-row style="padding: 5px; align-items: center">
          <TransformationOptions />
        </el-row>
      </el-header>

      <el-divider style="padding: 4px; margin-top: 20px; margin-bottom: 4px" />

      <el-container>
        <el-main style="padding-top: 0">
          <!-- Table -->
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="dataTableColumns"
                :data="tableAndOpStore.tableData"
                :width="width"
                :height="height"
              >
              </el-table-v2>
            </template>
          </el-auto-resizer>
        </el-main>

        <!--  Side bar  -->
        <el-aside width="30%">
          <el-tabs
            v-model="transformPanelStore.currentTabName"
            type="card"
            @tabRemove="onRemoveTabInfo"
          >
            <!-- Operation Stack  -->
            <el-tab-pane
              :label="'已添加步骤（' + tableAndOpStore.opStack.length + '）'"
              name="stepHistory"
              :closable="false"
            >
              <el-scrollbar>
                <el-button-group>
                  <el-button
                    :disabled="tableAndOpStore.opStack.length <= 1"
                    @click="undoOpAddToStackMonaco()"
                  >
                    <img
                      alt="Vue logo"
                      class="logo"
                      :src="'/src/assets/Undo.svg'"
                      width="13"
                      height="13"
                    />
                    撤销
                  </el-button>
                  <el-button
                    :disabled="tableAndOpStore.opRedoStack.length === 0"
                    @click="redoOpAddToStackMonaco()"
                  >
                    重做
                    <img
                      alt="Vue logo"
                      class="logo"
                      :src="'/src/assets/Redo.svg'"
                      width="13"
                      height="13"
                    />
                  </el-button>
                </el-button-group>
                <el-table :data="opStackAsTableFormat">
                  <el-table-column prop="title" label="处理类型"></el-table-column>
                  <el-table-column label="Spark代码" style="width: 75%">
                    <template #default="scope">
                      <pre>{{ scope.row.code }}</pre>
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
            </el-tab-pane>

            <el-tab-pane
              label="新增步骤"
              name="stepConfig"
              closable
              v-if="transformPanelStore.currentTransformationPanel !== ''"
            >
              <!-- transform configuration panel -->
              <el-scrollbar max-height="75vh">
                <component
                  :is="transformationPanels[transformPanelStore.currentTransformationPanel]"
                  style="padding: 0.5em 0.5em 0.5em"
                ></component>

                <EmptyTransformation
                  v-if="transformPanelStore.currentTransformationPanel === ''"
                  :has-load-data="tableAndOpStore.opStack.length !== 0"
                ></EmptyTransformation>
              </el-scrollbar>
            </el-tab-pane>

            <el-tab-pane
              :closable="true"
              v-if="colInfoStore.currentColumnName !== ''"
              label="列信息"
              name="colInfo"
            >
              <ShowColInfo style="width: 100%" />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="tsx" setup>
import { DocumentAdd, ArrowDown } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import {
  redoOpAddToStackMonaco,
  undoOpAddToStackMonaco,
  useTableAndOpStackStore
} from '@/stores/table-store'
import TransformationOptions from '@/components/data-wrangler/TransformationOptions.vue'
import { useTransformationPanelStore } from '@/stores/transformation-panel'
import DropColumnTransformation from '@/components/data-wrangler/transformations/DropColumnTransformation.vue'
import RenameColumnTransformation from '@/components/data-wrangler/transformations/RenameColumnTransformation.vue'
import CustomScalaTransformation from '@/components/data-wrangler/transformations/CustomScalaTransformation.vue'
import FormatStringTransformation from '@/components/data-wrangler/transformations/FormatStringTransformation.vue'
import TypeCastTransformation from '@/components/data-wrangler/transformations/TypeCastTransformation.vue'
import CustomSqlTransformation from '@/components/data-wrangler/transformations/CustomSqlTransformation.vue'
import {
  LoadTableFromScalaOp,
  LoadTableFromSqlOp
} from '@/ts/data-wrangler/transformation-operations'
import EmptyTransformation from '@/components/data-wrangler/transformations/EmptyTransformation.vue'
import SaveToDeltaTable from '@/components/data-wrangler/transformations/SaveToDeltaTable.vue'
import DownloadTable from '@/components/data-wrangler/transformations/DownloadTable.vue'
import { useColumnInfoStore } from '@/stores/column-info-store'
import { ElButton } from 'element-plus'
import type { TabPaneName } from 'element-plus'
import ShowColInfo from '@/components/data-wrangler/ShowColInfo.vue'
import SplitColumnTransformation from '@/components/data-wrangler/transformations/SplitColumnTransformation.vue'
import CountMatchTransformation from '@/components/data-wrangler/transformations/CountMatchTransformation.vue'
import MergeColumnTransformation from '@/components/data-wrangler/transformations/MergeColumnTransformation.vue'
import FilterRowsTransformation from '@/components/data-wrangler/transformations/FilterRowsTransformation.vue'
import FilterColumnsTransformation from '@/components/data-wrangler/transformations/FilterColumnsTransformation.vue'

/* State containers */
const tableAndOpStore = useTableAndOpStackStore()
const transformPanelStore = useTransformationPanelStore()
const colInfoStore = useColumnInfoStore()
const isLoadingData = ref(false)
const isShowLoadTableDialogFromFilePath = ref(false)
const isShowLoadTableDialogFromScala = ref(false)
const isShowLoadTableDialogFromSql = ref(false)

const transformationPanels: { [key: string]: any } = {
  TransformationOptions,
  DropColumnTransformation,
  RenameColumnTransformation,
  CustomScalaTransformation,
  FormatStringTransformation,
  TypeCastTransformation,
  CustomSqlTransformation,
  EmptyTransformation,
  SaveToDeltaTable,
  DownloadTable,
  SplitColumnTransformation,
  CountMatchTransformation,
  FilterRowsTransformation,
  FilterColumnsTransformation,
  MergeColumnTransformation
}

/* Table information */
const opStackAsTableFormat = computed(() =>
  tableAndOpStore.opStack.map((op) => ({
    title: op.title,
    code: op.asScalaScript()
  }))
)

const dataTableColumns = computed(() => {
  return tableAndOpStore.tableColSchemas.map((colSchema) => ({
    key: colSchema.name,
    dataKey: colSchema.name,

    headerCellRenderer: () => {
      return (
        <ElButton
          link
          onClick={() => {
            onColHeaderClick(colSchema.name)
          }}
        >
          {colSchema.name}
        </ElButton>
      )
    },
    width: 160
  }))
})

const onColHeaderClick = (name: string) => {
  colInfoStore.currentColumnName = name
  transformPanelStore.currentTabName = 'colInfo'
}

const onRemoveTabInfo = (tabPaneName: TabPaneName) => {
  if (tabPaneName === 'colInfo') {
    colInfoStore.currentColumnName = ''
  } else {
    transformPanelStore.currentTransformationPanel = ''
  }
  transformPanelStore.currentTabName = 'stepHistory'
}

const getCurrentFileNameTitleStr = (): string => {
  if (tableAndOpStore.opStack.length === 0) {
    return '选择数据集'
  }

  const loadOp = tableAndOpStore.opStack[0]
  let name = ''
  const maxLength = 50
  if (loadOp instanceof LoadTableFromSqlOp) {
    if (loadOp.sqlCode.length < maxLength) {
      name = loadOp.sqlCode
    } else {
      name = loadOp.sqlCode.slice(0, maxLength) + '...'
    }
  }
  return name
}

const onConfirmLoadTableFromSql = (code: string) => {
  const op = new LoadTableFromSqlOp()
  op.sqlCode = code
  tableAndOpStore.loadData(op)
  isShowLoadTableDialogFromSql.value = false
}
const onConfirmLoadTableFromScala = (code: string) => {
  const op = new LoadTableFromScalaOp()
  op.code = code
  tableAndOpStore.loadData(op)
  isShowLoadTableDialogFromScala.value = false
}
</script>

<style>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
