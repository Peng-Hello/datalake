import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useTableAndOpStackStore } from '@/stores/table-store'

interface CounterEntry {
  name: any
  value: number
}

const compareByValue = (a: CounterEntry, b: CounterEntry) => {
  if (a.value < b.value) {
    return -1
  } else if (a.value === b.value) {
    return 0
  } else {
    return 1
  }
}
const compareByName = (a: CounterEntry, b: CounterEntry) => {
  const name1 = a.name === undefined ? 'undefined' : a.name
  const name2 = b.name === undefined ? 'undefined' : b.name
  if (name1 < name2) {
    return -1
  } else if (name1 === name2) {
    return 0
  } else {
    return 1
  }
}

export const useColumnInfoStore = defineStore('colInfo', () => {
  const tableStore = useTableAndOpStackStore()
  const currentColumnName = ref('')
  const currentColumnSchema = computed(
    () => tableStore.tableColSchemas.filter((schema) => schema.name == currentColumnName.value)[0]
  )
  const notNullValueCount = computed(() => {
    if (currentColumnName.value === '') {
      return 0
    } else {
      return tableStore.tableData
        .map((row) => {
          if (row[currentColumnName.value] === null || row[currentColumnName.value] === undefined) {
            return 0
          } else {
            return 1
          }
        })
        .reduce((partialSum: number, a) => partialSum + a, 0)
    }
  })
  const nullValueCount = computed(() => {
    const rowsCount = tableStore.tableData.length
    return rowsCount - notNullValueCount.value
  })

  const histogramCount = computed(() => {
    const map: Map<any, number> = new Map()
    tableStore.tableData
      .map((row) => row[currentColumnName.value] as number | string | undefined)
      .forEach((entry) => {
        const previousValue = map.get(entry)
        map.set(entry, (previousValue === undefined ? 0 : previousValue) + 1)
      })

    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => {
      if (
        currentColumnSchema.value.type === 'string' ||
        currentColumnSchema.value.type === 'boolean'
      ) {
        return compareByValue(a, b)
      } else {
        return compareByName(a, b)
      }
    })
  })

  const histogramXCategories = computed(() => {
    return histogramCount.value.map((item) => item.name)
  })
  const histogramYValues = computed(() => {
    return histogramCount.value.map((item) => {
      if (item.name === undefined) {
        return {
          value: item.value,
          itemStyle: {
            color: '#f64d4d'
          }
        }
      } else {
        return item.value
      }
    })
  })

  return {
    currentColumnName,
    currentColumnSchema,
    notNullValueCount,
    nullValueCount,
    histogramXCategories,
    histogramYValues
  }
})
