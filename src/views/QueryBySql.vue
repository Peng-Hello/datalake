<script lang="ts" setup>
import { ref } from "vue";
import DataTable from "../component/DataTable.vue";
import { PlayCircleOutline, EyeOutline } from "@vicons/ionicons5";
import { Eraser24Regular } from "@vicons/fluent";
const sql = ref("");
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
        <n-button type="success">
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
    </n-space>
    <DataTable :max-height="350" class="mt-6"></DataTable>
</template>
<style lang="scss" scoped></style>
