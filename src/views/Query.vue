<script lang="ts" setup>
import { ref, Ref } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
import type { PostQueryForm } from "../type/postQueryForm.type";
import DataTable from "../component/DataTable.vue";
import { Search, CloudDownload } from "@vicons/ionicons5";
import {
    initTableSelectItem,
    selectTableOptions,
} from "../hooks/getSelectTableItem.hook";
import { downloadFun } from "../hooks/download.hook";
import {
    getTableDataByConditionApi,
    downloadTableDataByConditionApi,
} from "../api/Query/index.api";
initTableSelectItem();
const message = useMessage();
const form: Ref<PostQueryForm> = ref({
    id: "",
    text: "",
    timestamp: null,
    source: "",
    symbols: "",
    company_name: "",
    table: null,
});
const formRef = ref<FormInst | null>(null);
const dataTableRef = ref();
function onClickSearchBtn() {
    formRef.value?.validate((errors) => {
        if (!errors) {
            message.success("Please Wait");
            dataTableRef.value.updateData();
        } else {
            message.error("Please select a table");
        }
    });
}
function onClickDownloadBtn() {
    formRef.value?.validate((errors) => {
        if (!errors) {
            message.success("Please Wait");
            downloadTableDataByConditionApi(form.value)
                .then((res) => {
                    console.log(res);
                    // const date = new Date();
                    // let fileName =
                    //     "员工信息" +
                    //     `${date.getFullYear()}-` +
                    //     `${date.getMonth() + 1}-` +
                    //     `${date.getDate()}` +
                    //     ".xlsx";
                    downloadFun(res.headers.filename!, res.data);
                })
                .catch((err) => {
                    message.error("Download error");
                });
        } else {
            message.error("Please select a table");
        }
    });
}
</script>
<template>
    <n-form
        ref="formRef"
        inline
        :label-width="80"
        :model="form"
        :rules="{
            table: {
                required: true,
                trigger: ['blur', 'change'],
                message: 'Please select a table',
            },
        }"
    >
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
                    v-model:formatted-value="form.timestamp"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
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
            <n-gi>
                <n-form-item label="select table" path="table">
                    <n-select
                        placeholder="Please select table"
                        v-model:value="form.table"
                        :options="selectTableOptions"
                    />
                </n-form-item>
            </n-gi>
        </n-grid>
    </n-form>
    <div class="mt-5 flex items-center">
        <div class="text-md">Result:</div>
        <div class="flex-grow text-right">
            <n-button type="info" @click="onClickSearchBtn">
                <template #icon>
                    <n-icon>
                        <Search></Search>
                    </n-icon>
                </template>
                Search
            </n-button>
            <n-button
                type="success"
                class="margin-left"
                @click="onClickDownloadBtn"
            >
                <template #icon>
                    <n-icon>
                        <CloudDownload></CloudDownload>
                    </n-icon>
                </template>
                Download
            </n-button>
        </div>
    </div>

    <DataTable
        ref="dataTableRef"
        :max-height="350"
        :update-fun="() => getTableDataByConditionApi(form)"
        class="mt-6"
    ></DataTable>
</template>
<style lang="scss" scoped>
.margin-left {
    margin-left: 16px;
}
</style>
