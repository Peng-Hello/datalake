<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        Data Lake Demo
        <el-alert
          type="warning"
          title="开发中。最终设计可能会与当前页面的呈现效果有所差异。"
        ></el-alert>
      </el-header>
      <el-container>
        <el-aside width="15vw" style="height: 90vh">
          <!-- Side bar -->
          <el-menu>
            <RouterLink to="/query_by_sql">
              <el-menu-item index="2">Query by SQL</el-menu-item>
            </RouterLink>
            <RouterLink to="/query_by_conditions">
              <el-menu-item index="1">Query by Conditions</el-menu-item>
            </RouterLink>
            <RouterLink to="/upload_files">
              <el-menu-item index="3">Upload Data</el-menu-item>
            </RouterLink>
            <RouterLink to="/">
              <el-menu-item index="4">Wrangle Data</el-menu-item>
            </RouterLink>
            <RouterLink to="/job_manager">
              <el-menu-item index="5">Job Manager</el-menu-item>
            </RouterLink>
          </el-menu>
        </el-aside>

        <el-main>
          <!-- contents in each page -->
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped></style>
