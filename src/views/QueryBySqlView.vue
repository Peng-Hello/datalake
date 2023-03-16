<template>
  <TabViewScaffold style="width: 100%">
    <template #title> SQL语句查询 </template>

    <template #default>
      <MonacoEditor
        syntax-check-type="sql"
        :is-support-df-as-shortcut="false"
        :is-editor-clear-needed="isEditorClearNeeded"
        @text-change="onTextChange"
        @text-cleared="onTextCleared"
        editorWidth="60vw"
      ></MonacoEditor>

      <el-button @click="onClickRunBtn()">
        <el-icon>
          <VideoPlay />
        </el-icon>
        Run
      </el-button>
      <el-button @click="clearEditor()">
        <el-icon>
          <RefreshLeft />
        </el-icon>
        Clear
      </el-button>
      <el-button @click="onClickDownloadBtn()">
        <el-icon>
          <Download />
        </el-icon>
        Download
      </el-button>

      <p>结果</p>
      <div>
        <DataTable ref="dataTableRef" :update-fun="() => getTableDataBySQL(sqlContent)"></DataTable>
      </div>
    </template>
  </TabViewScaffold>
</template>

<script lang="tsx" setup>
import { notImplementedMessage } from '@/ts/data-wrangler/common-utils-functions'
import { ref } from 'vue'
import { Timer, VideoPlay, RefreshLeft, Download } from '@element-plus/icons-vue'

import dayjs from 'dayjs'
import { ElButton, ElIcon, ElTag, ElTooltip, TableV2FixedDir } from 'element-plus'

import type { Column } from 'element-plus'
import { downloadFun } from '../ts/download'
import { getTableDataBySQL, downloadTableDataBySqlApi } from '../api/QueryBySql/index.api'

const dataTableRef = ref()

const sqlContent = ref('')
const isEditorClearNeeded = ref(false)
const clearEditor = () => {
  isEditorClearNeeded.value = true
}
const onTextChange = (newText: string) => {
  sqlContent.value = newText
}
const onTextCleared = () => {
  isEditorClearNeeded.value = false
}

function onClickRunBtn() {
  if (sqlContent.value !== '') {
    dataTableRef.value.updateData()
  } else {
    console.log('请输入SQL')
  }
}

function onClickDownloadBtn() {
  if (sqlContent.value !== '') {
    downloadTableDataBySqlApi(sqlContent.value).then((res) => {
      downloadFun(res.headers.filename!, res.data)
    })
  } else {
    console.log('请输入SQL')
  }
}
</script>

<style scoped></style>
