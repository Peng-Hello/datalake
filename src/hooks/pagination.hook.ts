import { ref, Ref } from "vue";
import { PageSizes } from "../const";
export const currentPage = ref(1);
let requestFun: Function;
let datas: Ref<any[]>;
export function pageNoChange(page: number): void {
    currentPage.value = page;
    requestFun().then((res: any) => {
        const toObject = JSON.parse('{"data":' + res[0].resultTable + "}");
        datas.value = toObject.data;
    });
}
export function setRequestFun(fun: Function) {
    requestFun = fun;
}
export function setAssociatedData(data: Ref<any[]>) {
    datas = data;
}
