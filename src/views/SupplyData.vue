<script lang="ts" setup>
import { ref, Ref } from "vue";
import { ArchiveOutline as ArchiveIcon, CloudUpload } from "@vicons/ionicons5";
import type { UploadInst, UploadFileInfo } from "naive-ui";
import type { PostQueryForm } from "../type/postQueryForm.type";
import { selectFileTpyeOptions } from "../hooks/getFileTypeItem.hook";
import DataTable from "../component/DataTable.vue";
import { postDataApi } from "../api/SupplyData/index";
import { getTableDataByConditionApi } from "../api/Query/index.api";
const fileType = ref(".csv");
const fileListLength = ref(0);
const uploadRef = ref<UploadInst | null>(null);
let uploadFileInfo: UploadFileInfo;
const form: Ref<PostQueryForm> = ref({
    id: "",
    text: "",
    timestamp: null,
    source: "",
    symbols: "",
    company_name: "",
    table: null,
});
const dataTableRef = ref();
function handleChange(options: { fileList: UploadFileInfo[] }) {
    fileListLength.value = options.fileList.length;
    if (fileListLength.value !== 0) {
        uploadFileInfo = options.fileList[0];
    }
}
function handleClick() {
    const { file } = uploadFileInfo;
    postDataApi(file!).then((res) => {
        form.value.table = res;
        dataTableRef.value.updateData();
    });
}
</script>
<template>
    <n-space align="center" class="mb-1">
        <n-text> Select the corresponding file type: </n-text>
        <n-select
            v-model:value="fileType"
            :options="selectFileTpyeOptions"
            class="w-40 mr-10"
        />
    </n-space>
    <n-space align="center" class="mb-5">
        <n-text>Upload File:</n-text>
        <n-button
            type="info"
            class="w-7"
            :disabled="!fileListLength"
            @click="handleClick"
        >
            <template #icon>
                <n-icon>
                    <CloudUpload></CloudUpload>
                </n-icon>
            </template>
            Upload
        </n-button>
    </n-space>

    <n-upload
        ref="uploadRef"
        multiple
        directory-dnd
        :default-upload="false"
        :max="1"
        :accept="fileType"
        @change="handleChange"
        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    >
        <n-upload-dragger>
            <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                    <archive-icon />
                </n-icon>
            </div>
            <n-text style="font-size: 16px">
                Click or drag files to this area to select them
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
                Please select json,img,csv format files
            </n-p>
        </n-upload-dragger>
    </n-upload>
    <DataTable
        ref="dataTableRef"
        :max-height="350"
        :update-fun="() => getTableDataByConditionApi(form)"
        class="mt-6"
    ></DataTable>
</template>
<style lang="scss" scoped></style>
