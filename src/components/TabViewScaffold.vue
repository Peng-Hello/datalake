<template>
  <el-container>
    <el-header><slot name="title"></slot> </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup></script>

<style scoped></style>
