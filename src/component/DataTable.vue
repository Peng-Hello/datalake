<script lang="ts" setup>
import { defineProps, ref, defineExpose } from "vue";
import { Ref } from "vue";
import { DataTableColumns } from "naive-ui";
import type { PostQueryForm } from "../type/postQueryForm.type";
import {
    currentPage,
    pageNoChange,
    setRequestFun,
    setAssociatedData,
} from "../hooks/pagination.hook";
import { PageSizes } from "../const";
import { parseJSON } from "date-fns";
import { useMessage } from "naive-ui";
const props = defineProps<{
    maxHeight: number;
    updateFun: () => Promise<any>;
}>();
type TableItem = {
    title: string;
    key: string;
    align: string;
};
const message = useMessage();
const tableHeader: Ref<DataTableColumns<TableItem>> = ref([]);
const createColumns = (): DataTableColumns<TableItem> => {
    return tableHeader.value;
};
const maxPage = ref(1);
const columns = createColumns();
const data: Ref<any[]> = ref([]);
function updateData() {
    const dataPromise: Promise<any> = props.updateFun();
    setRequestFun(props.updateFun); // 设置页更新方法
    setAssociatedData(data);
    currentPage.value = 1; // 初始化页号
    dataPromise.then((res) => {
        if (res.message === "操作成功！") {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        const resArray = res.result;
        maxPage.value = resArray[0].total;
        const toObject = JSON.parse('{"data":' + resArray[0].resultTable + "}");
        const firstItem = toObject.data[0];
        const tableHeaderArray = tableHeader.value;
        tableHeaderArray.length = 0;
        for (let field in firstItem) {
            const tempHeaderItemConfig: TableItem = {
                title: field,
                key: field,
                align: "center",
            };
            tableHeaderArray.push(tempHeaderItemConfig as any);
        }
        //console.log(toObject.data);
        transformDatas(toObject.data);
        data.value = toObject.data;
    });
}
function transformDatas(array: any[]) {
    array.forEach((item) => {
        for (let key in item) {
            if (item[key] instanceof Object) {
                item[key] = JSON.stringify(item[key]);
            }
        }
    });
}
defineExpose({
    updateData,
});
</script>
<template>
    <n-data-table
        :columns="columns"
        :data="data"
        :max-height="props.maxHeight"
        class="mt-4"
    />
    <n-pagination
        v-model:page="currentPage"
        :page-count="maxPage"
        :on-update:page="pageNoChange"
        class="mt-4"
    />
</template>
<style lang="scss" scoped></style>
