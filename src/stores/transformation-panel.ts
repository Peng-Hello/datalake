import { defineStore, storeToRefs } from 'pinia'
import { type Ref, ref } from 'vue'
import { CustomScalaScriptOp, TransformOp } from '@/ts/data-wrangler/transformation-operations'
import type { ServerException } from '@/ts/data-wrangler/exception'
import { errorMessage, findRootCause } from '@/ts/data-wrangler/common-utils-functions'
import { useTableAndOpStackStore } from '@/stores/table-store'

export const useTransformationPanelStore = defineStore('transformation', () => {
  /**
   * Internal operation state representation.
   *
   * Since each user can only operate on one transformation at a time and
   * this store is independent for each opened page,
   * there is no need to wrap codes into concurrent conflict-free data structure.
   */
  const currentOp: Ref<TransformOp> = ref(new CustomScalaScriptOp())
  const currentTransformationPanel = ref('') // sub panel in transform step
  const currentTabName = ref('stepHistory')

  /**
   * Submit current operation to opStack, and recreate a new TransformOp object
   * to reset to the initial state.
   */
  const submit = async () => {
    await currentOp.value
      .submit()
      .finally(() => {
        currentOp.value = currentOp.value.cloneAndResetOp()
      })
      .catch((exception) => {
        /* reset state */

        useTableAndOpStackStore().opStack.pop()

        /* find out root cause and display error message */
        const serverException: ServerException | undefined = exception.response.data.exception
        const rootCause = findRootCause(serverException).replace('\n', '<br>')
        const message = `<p>${currentOp.value.asDescriptiveTitle()}操作失败。原因：</p><p>${
          rootCause === '' ? exception : rootCause
        }</p>`

        errorMessage(message, 'long', true)
      })
  }

  const resetFormWithOp = (op: TransformOp) => {
    currentOp.value = op
  }

  const resetFormWithEmptyValue = () => {
    currentOp.value = currentOp.value.cloneAndResetOp()
  }

  return {
    currentOp,
    currentTransformationPanel,
    submit,
    currentTabName,
    resetFormWithOp,
    resetFormWithEmptyValue
  }
})

export function resetAndGetRefFromTransformationPanelStore<T extends TransformOp>(op: T) {
  const store = useTransformationPanelStore()
  store.currentOp = op
  const { currentOp } = storeToRefs(store)
  return currentOp as Ref<T>
}

export const transformationSuggestionList = [
  {
    label: '列操作',
    options: [
      {
        label: '分割列',
        value: 'SplitColumnTransformation',
        icon: 'SplitCell'
      },
      {
        label: '合并列',
        value: 'MergeColumnTransformation',
        icon: 'MergeCell'
      },
      {
        label: '删除列',
        value: 'DropColumnTransformation',
        icon: 'Delete'
      },

      {
        label: '重命名列',
        value: 'RenameColumnTransformation',
        icon: 'Rename'
      },
      {
        label: '转换列数据类型',
        value: 'TypeCastTransformation',
        icon: 'Cast'
      }
    ]
  },
  {
    label: '数据处理',
    options: [
      {
        label: '字符串处理',
        value: 'FormatStringTransformation',
        icon: 'FormatShape'
      },
      {
        label: '匹配某个值',
        value: 'CountMatchTransformation',
        icon: 'MatchWord'
      }
    ]
  },
  {
    label: '自定义处理',
    options: [
      {
        label: 'SQL代码',
        value: 'CustomSqlTransformation',
        icon: 'DatabaseCode'
      },
      {
        label: 'Scala代码',
        value: 'CustomScalaTransformation',
        icon: 'FileCode'
      }
    ]
  }
]
