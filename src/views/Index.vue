<script setup lang="ts">
import { menuOptions } from "../share/config/menu.config";
</script>

<template>
    <n-layout has-sider class="container">
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="57"
            :width="240"
            show-trigger="arrow-circle"
        >
            <n-scrollbar style="max-height: 100vh">
                <n-menu :options="menuOptions" default-value="query" />
            </n-scrollbar>
        </n-layout-sider>
        <n-layout>
            <n-scrollbar style="max-height: 100vh">
                <n-layout-header bordered>颐和园路</n-layout-header>
                <n-layout-content>
                    <router-view></router-view>
                </n-layout-content>
            </n-scrollbar>
        </n-layout>
    </n-layout>
</template>

<style lang="scss" scoped>
.container {
    height: 100vh;
    .n-layout-header {
        height: 47px;
    }
}
</style>
