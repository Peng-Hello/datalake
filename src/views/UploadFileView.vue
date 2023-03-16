<script lang="tsx" setup>
import { ref } from 'vue'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'

import { notImplementedMessage } from '@/ts/data-wrangler/common-utils-functions'
import dayjs from 'dayjs'
import { ElButton, ElIcon, ElTag, ElTooltip, TableV2FixedDir } from 'element-plus'
import { Timer, UploadFilled } from '@element-plus/icons-vue'

import type { Column } from 'element-plus'
import { getTableDataByConditionApi, getTablesApi } from '../api/Query/index.api'
import { postDataApi } from '../api/SupplyData/index'

const uploadRef = ref<UploadInstance>()
const dataTableRef = ref()
let pendingUploadFile: File
const showFileNames = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  pendingUploadFile = uploadFile.raw!
}

const form = ref({
  id: '',
  text: '',
  timestamp: null,
  source: '',
  symbols: '',
  company_name: '',
  table: null
})

const fileFormatOptions = [
  {
    value: '.csv',
    label: 'csv'
  },
  {
    value: '.json',
    label: 'json'
  },
  {
    value: '.jpg',
    label: 'jpg'
  },
  {
    value: '.png',
    label: 'png'
  }
]

const uploadOptions = [
  {
    value: 'append',
    label: '在表最后追加（append）'
  },
  {
    value: 'overwrite',
    label: '覆盖原文件（overwrite）'
  },
  {
    value: 'error',
    label: '报错（error）'
  },
  {
    value: 'ignore',
    label: '跳过不上传（ignore）'
  },
  {
    label: 'errorifexists',
    value: 'errorifexists'
  }
]
const tableNameList = ref<string[]>([''])
const uploadForm = ref({
  format: fileFormatOptions[0].value,
  mode: uploadOptions[0].value,
  table: tableNameList.value[0]
})

getTablesApi().then((res) => {
  tableNameList.value = res
  if (res[0]) {
    uploadForm.value.table = res[0]
  }
})
function handleClick() {
  if (pendingUploadFile) {
    postDataApi(pendingUploadFile, uploadForm.value.mode, uploadForm.value.table).then((res) => {
      form.value.table = res
      dataTableRef.value.updateData()
    })
  }
}
</script>

<template>
  <TabViewScaffold>
    <template #title> 上传文件到数据湖 </template>

    <template #default>
      <el-upload
        class="upload"
        drag
        :limit="1"
        :auto-upload="false"
        :accept="uploadForm.format"
        ref="uploadRef"
        @change="showFileNames"
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <template #tip>
          <div class="el-upload__tip">支持JPG/PNG/JSON/CSV文件。</div>
        </template>
      </el-upload>

      <el-form>
        <el-form-item label="文件格式">
          <el-select v-model="uploadForm.format">
            <el-option
              v-for="item in fileFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="重复文件处理">
          <el-select v-model="uploadForm.mode">
            <el-option
              v-for="item in uploadOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择上传的表">
          <el-select v-model="uploadForm.table">
            <el-option v-for="item in tableNameList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClick()">上传</el-button>
        </el-form-item>
      </el-form>

      <p>表格预览</p>
      <div>
        <DataTable
          ref="dataTableRef"
          :update-fun="() => getTableDataByConditionApi(form)"
        ></DataTable>
      </div>
    </template>
  </TabViewScaffold>
</template>
<style scoped></style>
