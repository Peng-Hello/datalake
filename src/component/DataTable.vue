<script lang="ts" setup>
import { defineProps } from "vue";
import type { DataTableColumns } from "naive-ui";
const props = defineProps<{
    maxHeight: number;
}>();
type TableItem = {
    title: string;
    key: string;
    align: string;
};
const createColumns = (): DataTableColumns<TableItem> => {
    return [
        {
            title: "id",
            key: "id",
            align: "center",
        },
        {
            title: "text",
            key: "text",
            align: "center",
        },
        {
            title: "timestamp",
            key: "timestamp",
            align: "center",
        },
        {
            title: "source",
            key: "source",
            align: "center",
        },
        {
            title: "symbols",
            key: "symbols",
            align: "center",
        },
        {
            title: "company_name",
            key: "company_name",
            align: "center",
        },
    ];
};
const columns = createColumns();
const data = Array.from({ length: 46 }).map((_, index) => ({
    key: index,
    id: ` ${index}`,
    text: "test",
    timestamp: `12345566`,
    source: "test",
    symbols: "test",
    company_name: "test",
}));

const pagination = {
    pageSize: 15,
};
</script>
<template>
    <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :max-height="props.maxHeight"
    />
</template>
<style lang="scss" scoped></style>
