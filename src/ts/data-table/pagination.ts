import type { Ref } from 'vue'

export const currentPage = ref(1)
let requestFun: Function
let datas: Ref<any[]>
export function pageNoChange(): void {
  requestFun().then((res: any) => {
    const toObject = JSON.parse('{"data":' + res.result[0].resultTable + '}')
    datas.value = toObject.data
  })
}
export function setRequestFun(fun: Function) {
  requestFun = fun
}
export function setAssociatedData(data: Ref<any[]>) {
  datas = data
}
