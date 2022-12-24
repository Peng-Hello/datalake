<script lang="ts" setup>
import { ref } from "vue";
import DataTable from "./DataTable.vue";
const form = ref({
    id: "",
    text: "",
    timestamp: [1183135260000, Date.now()],
    source: "",
    symbols: "",
    company_name: "",
});
</script>
<template>
    <n-grid :x-gap="32" :y-gap="8" :cols="3">
        <n-gi>
            <n-text>id:</n-text>
            <n-input
                v-model:value="form.id"
                type="text"
                placeholder="Please enter the ID"
                clearable
            />
        </n-gi>
        <n-gi>
            <n-text>text:</n-text>
            <n-input
                v-model:value="form.text"
                type="text"
                placeholder="Please enter the text keyword"
                clearable
            />
        </n-gi>
        <n-gi>
            <n-text>timestamp:</n-text>
            <n-date-picker
                v-model:value="form.timestamp"
                type="datetimerange"
                clearable
            />
        </n-gi>
        <n-gi>
            <n-text>source:</n-text>
            <n-input
                v-model:value="form.source"
                type="text"
                placeholder="Please enter the source"
                clearable
            />
        </n-gi>
        <n-gi>
            <n-text>symbols:</n-text>
            <n-input
                v-model:value="form.symbols"
                type="text"
                placeholder="Please enter the symbols"
                clearable
            />
        </n-gi>
        <n-gi>
            <n-text>company_name:</n-text>
            <n-input
                v-model:value="form.company_name"
                type="text"
                placeholder="Please enter the company_name:"
                clearable
            />
        </n-gi>
    </n-grid>
    <DataTable :max-height="250" class="mt-5"></DataTable>
</template>
<style lang="scss" scoped></style>
