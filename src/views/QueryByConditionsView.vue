<script lang="tsx" setup>
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'

/* fixme 以下为样例数据 */
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import {
  getTableDataByConditionApi,
  downloadTableDataByConditionApi,
  getTablesApi
} from '../api/Query/index.api'
import { downloadFun } from '../ts/download'
const tableNameList = ref<string[]>([''])
getTablesApi().then((res) => {
  tableNameList.value = res
  if (res[0]) {
    form.table = res[0]
  }
})

const dateTime = ref<[Date, Date] | []>([])
const timestampList = computed(() => {
  return Array.from(dateTime.value, (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  })
})
const form = reactive({
  id: '',
  text: '',
  timestamp: timestampList,
  source: '',
  symbols: '',
  company_name: '',
  table: ''
})
const rules = reactive<FormRules>({
  table: [
    {
      required: true,
      message: 'Please select table',
      trigger: 'change'
    }
  ]
})

const ruleFormRef = ref<FormInstance>()
const dataTableRef = ref()
const searchBtn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dataTableRef.value.updateData()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onClickDownloadBtn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      downloadTableDataByConditionApi(form)
        .then((res) => {
          downloadFun(res.headers.filename!, res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<template>
  <TabViewScaffold>
    <template #title>通过条件查询</template>

    <template #default>
      <el-form ref="ruleFormRef" :inline="true" :rules="rules" :model="form" status-icon>
        <el-form-item label="表名" required prop="table">
          <el-select v-model="form.table" placeholder="选择一个数据表">
            <el-option v-for="item in tableNameList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="id:">
          <el-input v-model="form.id" placeholder="请输入 id" />
        </el-form-item>
        <el-form-item label="company_name:">
          <el-input v-model="form.company_name" placeholder="请输入 company_name" />
        </el-form-item>

        <el-form-item label="source:">
          <el-input v-model="form.source" placeholder="请输入 source" />
        </el-form-item>
        <el-form-item label="text:">
          <el-input v-model="form.text" placeholder="请输入 text" />
        </el-form-item>
        <el-form-item label="symbols:">
          <el-input v-model="form.symbols" placeholder="请输入 symbols" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn(ruleFormRef)">搜索</el-button>
          <el-button @click="onClickDownloadBtn(ruleFormRef)">下载</el-button>
        </el-form-item>
      </el-form>

      <p>结果</p>
      <div style="height: 100%; min-height: 50vh">
        <DataTable
          ref="dataTableRef"
          :update-fun="() => getTableDataByConditionApi(form)"
        ></DataTable>
      </div>
    </template>
  </TabViewScaffold>
</template>
<style scoped></style>
