<script lang="ts" setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import DataTable from "../component/DataTable.vue";
import { PlayCircleOutline, CloudDownload } from "@vicons/ionicons5";
import { Eraser24Regular } from "@vicons/fluent";
import { getTableDataBySQL } from "../api/QueryBySql/index.api";
import { downloadFun } from "../hooks/download.hook";
import { downloadTableDataBySqlApi } from "../api/QueryBySql/index.api";
const sql = ref("");
const dataTableRef = ref();
const message = useMessage();
function onClickRunBtn() {
    if (sql.value !== "") {
        dataTableRef.value.updateData();
    } else {
        message.error("请输入SQL");
    }
}
function onClickDownloadBtn() {
    if (sql.value !== "") {
        downloadTableDataBySqlApi(sql.value).then((res) => {
            downloadFun(res.headers.filename!, res.data);
        });
    } else {
        message.error("请输入SQL");
    }
}
</script>
<template>
    <n-text class="text-lg">Enter SQL statement:</n-text>
    <n-input
        v-model:value="sql"
        type="textarea"
        placeholder="Please enter your sql query"
        class="mt-3"
    />
    <n-space justify="end" align="center" class="mt-4">
        <n-button type="success" @click="onClickRunBtn">
            <template #icon>
                <PlayCircleOutline></PlayCircleOutline>
            </template>
            Run
        </n-button>
        <n-button
            type="warning"
            @click="
                () => {
                    sql = '';
                }
            "
        >
            <template #icon> <Eraser24Regular></Eraser24Regular> </template>
            Discard
        </n-button>
        <n-button type="info" @click="onClickDownloadBtn">
            <template #icon>
                <n-icon>
                    <CloudDownload></CloudDownload>
                </n-icon>
            </template>
            Download
        </n-button>
    </n-space>
    <DataTable
        ref="dataTableRef"
        :max-height="350"
        :update-fun="() => getTableDataBySQL(sql)"
        class="mt-6"
    ></DataTable>
</template>
<style lang="scss" scoped></style>
