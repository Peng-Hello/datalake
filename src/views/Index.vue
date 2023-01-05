<script setup lang="ts">
import { menuOptions } from "../share/config/menu.config"; // 导航菜单配置
import Header from "../share/component/Header.vue"; // 头部
</script>

<template>
    <n-layout
        has-sider
        class="_container"
        :content-style="{ 'overflow-x': 'visible' }"
    >
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
                <n-layout-header bordered><Header></Header></n-layout-header>
                <n-layout-content>
                    <router-view></router-view>
                </n-layout-content>
            </n-scrollbar>
        </n-layout>
    </n-layout>
</template>

<style lang="scss" scoped>
._container {
    height: 100vh;

    .n-layout-header {
        height: 47px;
    }
    .n-layout-content {
        width: calc(100vw - 240px);
        padding: 15px 25px;
    }
}
</style>
