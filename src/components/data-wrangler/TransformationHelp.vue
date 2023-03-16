<template>
  <el-collapse>
    <el-collapse-item>
      <template #title>
        <p>
          <el-icon class="header-icon">
            <InfoFilled />
          </el-icon>
          帮助
        </p>
      </template>
      <slot />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<style scoped></style>
