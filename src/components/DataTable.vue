<script lang="tsx" setup>
import { defineProps, ref, defineExpose } from 'vue'
import type { Ref } from 'vue'
import type { Column } from 'element-plus'

import {
  currentPage,
  pageNoChange,
  setRequestFun,
  setAssociatedData
} from '../ts/data-table/pagination'
import { PageSizes } from '../const'
import { isBase64 } from '../ts/isBase64'

const props = defineProps<{
  updateFun: () => Promise<any>
}>()
type TableItem = {
  key: string
  title: string
  dataKey: string
  width: number
  cellRenderer: Function
}
const tableHeaderArray = ref<Column<any>[]>([])
const maxPage = ref(1)

const data: Ref<any[]> = ref([])
function updateData() {
  const dataPromise: Promise<any> = props.updateFun()
  setRequestFun(props.updateFun) // 设置页更新方法
  setAssociatedData(data)
  currentPage.value = 1 // 初始化页号
  dataPromise.then((res) => {
    if (res.message === '操作成功！') {
      console.log()
    } else {
      console.log()
    }
    const resArray = res.result
    maxPage.value = resArray[0].total
    const toObject = JSON.parse('{"data":' + resArray[0].resultTable + '}')

    const firstItem = toObject.data[0]

    tableHeaderArray.value.length = 0
    for (let field in firstItem) {
      const tempHeaderItemConfig: TableItem = {
        key: field,
        title: field,
        dataKey: field,
        width: 350,
        cellRenderer: ({ cellData }: any) => {
          if (isBase64(cellData)) {
            return (
              <el-image
                style="width: 100px; height: 100px"
                src={'data:image/png;base64,' + cellData}
                fit="cover"
                preview-src-list={['data:image/png;base64,' + cellData]}
                zoom-rate={1.2}
              />
            )
          }
          return <div>{cellData}</div>
        }
      }
      tableHeaderArray.value.push(tempHeaderItemConfig as any)
    }
    transformDatas(toObject.data)
    data.value = toObject.data
  })
}
function transformDatas(array: any[]) {
  array.forEach((item) => {
    for (let key in item) {
      if (item[key] instanceof Object) {
        item[key] = JSON.stringify(item[key])
      }
    }
  })
}
defineExpose({
  updateData
})
</script>
<template>
  <div style="height: 50vh">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="tableHeaderArray"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
  <el-pagination
    background
    layout="prev, pager, next"
    v-model:current-page="currentPage"
    :total="maxPage"
    :page-size="PageSizes"
    @update:current-page="pageNoChange"
  />
</template>
<style lang="scss" scoped></style>
