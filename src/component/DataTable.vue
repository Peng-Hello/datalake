<script lang="ts" setup>
import { defineProps, ref, defineExpose } from "vue";
import type { Ref } from "vue";
import type { DataTableColumns } from "naive-ui";
import type { PostQueryForm } from "../type/postQueryForm.type";
import {
    currentPage,
    pageNoChange,
    setRequestFun,
    setAssociatedData,
} from "../hooks/pagination.hook";
import { PageSizes } from "../const";
import { parseJSON } from "date-fns";

const props = defineProps<{
    maxHeight: number;
    updateFun: () => Promise<any>;
}>();
type TableItem = {
    title: string;
    key: string;
    align: string;
};
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
        maxPage.value = res[0].total;
        const toObject = JSON.parse('{"data":' + res[0].resultTable + "}");
        const firstItem = toObject.data[0];
        const tableHeaderArray = <TableItem[]>tableHeader.value;
        tableHeaderArray.length = 0;
        for (let field in firstItem) {
            const tempHeaderItemConfig: TableItem = {
                title: field,
                key: field,
                align: "center",
            };
            tableHeaderArray.push(tempHeaderItemConfig);
        }

        data.value = toObject.data;
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
