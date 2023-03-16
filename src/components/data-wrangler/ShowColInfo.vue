<template>
  <div style="width: auto; position: relative">
    <el-descriptions :title="colInfoStore.currentColumnName" border>
      <el-descriptions-item label="可空性"
        >{{ colInfoStore.currentColumnSchema.nullable ? '可空' : '不为空' }}
      </el-descriptions-item>
      <el-descriptions-item label="类型">{{
        colInfoStore.currentColumnSchema.type
      }}</el-descriptions-item>
      <el-descriptions-item label="其他元数据">{{
        colInfoStore.currentColumnSchema.metadata
      }}</el-descriptions-item>
    </el-descriptions>

    <p></p>

    <el-row style="width: 100%">
      <el-col :span="12">
        <el-statistic title="有效值" :value="colInfoStore.notNullValueCount" />
        <span>{{
          Math.round(
            (colInfoStore.notNullValueCount /
              (colInfoStore.nullValueCount + colInfoStore.notNullValueCount)) *
              100
          ) + '%'
        }}</span>
      </el-col>

      <el-col :span="12">
        <el-statistic title="空值" :value="colInfoStore.nullValueCount" />
        <span>{{
          Math.round(
            (colInfoStore.nullValueCount /
              (colInfoStore.nullValueCount + colInfoStore.notNullValueCount)) *
              100
          ) + '%'
        }}</span>
      </el-col>
    </el-row>

    <v-chart class="chart" :option="option" style="width: 30vw; height: 10vh" />

    <p>直方图</p>
    <el-alert v-if="colInfoStore.histogramXCategories.length >= 20" type="warning"
      >这可能不是一个分类变量。</el-alert
    >
    <v-chart class="histogram-chart" :option="histogramOption" style="width: 30vw; height: 30vh" />
  </div>
</template>

<script lang="ts" setup>
import { useColumnInfoStore } from '@/stores/column-info-store'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, computed } from 'vue'

const colInfoStore = useColumnInfoStore()
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

provide(THEME_KEY, 'light')

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  xAxis: {
    type: 'value',
    show: false
  },
  yAxis: {
    type: 'category',
    show: false
  },
  legend: {
    // Try 'horizontal'
    orient: 'horizontal',
    top: 0
  },
  series: [
    {
      name: '有效值',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [colInfoStore.notNullValueCount]
    },
    {
      name: '空值',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [colInfoStore.nullValueCount],
      barWidth: '20%'
    }
  ]
}))

/* Histogram */
const histogramOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: colInfoStore.histogramXCategories
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: colInfoStore.histogramYValues,
      type: 'bar'
    }
  ]
}))
</script>

<style scoped></style>
