<script lang="ts" setup>
import { ref } from "vue";
import SelectFileTable from "../component/SelectFileTable.vue";
import DataTable from "../component/DataTable.vue";
import DetailedInfo from "../component/DetailedInfo.vue";
import { selectDbOptions } from "../hooks/getSelectDbItem.hook";
import { selectFileTpyeOptions } from "../hooks/getFileTypeItem.hook";
import { selectFileOptions } from "../hooks/getFileItem.hook";
import { Search } from "@vicons/ionicons5";
const selectedDbValue = ref("db1");
const selectedFileTypeValue = ref("mp4");
const selectedFileValue = ref("csv");
</script>
<template>
    <n-space align="center">
        <n-text>Select the database where the file is located:</n-text>
        <n-select
            v-model:value="selectedDbValue"
            :options="selectDbOptions"
            class="w-40 mr-10"
        />
        <n-text> Select the corresponding file type: </n-text>
        <n-select
            v-model:value="selectedFileTypeValue"
            :options="selectFileTpyeOptions"
            class="w-40 mr-10"
        />

        <n-button type="info" class="w-24"
            ><template #icon>
                <Search></Search>
            </template>
            Search
        </n-button>
    </n-space>
    <n-space align="center" class="mt-5">
        <n-text>Select corresponding file:</n-text>
        <n-select
            v-model:value="selectedFileValue"
            :options="selectFileOptions"
            class="w-56"
        />
    </n-space>
    <n-tabs type="line" animated class="mt-9">
        <n-tab-pane name="overall" tab="Overall information">
            <DataTable :max-height="350"></DataTable>
        </n-tab-pane>
        <n-tab-pane name="detailed" tab="Detailed informatio">
            <DetailedInfo></DetailedInfo>
        </n-tab-pane>
    </n-tabs>
</template>
<style lang="scss" scoped></style>
