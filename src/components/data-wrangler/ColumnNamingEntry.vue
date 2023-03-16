<template>
  <el-alert type="error" :closable="false">
    <el-tag type="danger" effect="dark">列命名规则</el-tag>
    <p>
      列名中不可含有<b>空格</b>和<b>特殊字符<code>,;{}()\n\t=</code></b
      >，Delta Lake无法处理带有此类列名的表。
    </p>

    <HelpTaggedEntry tag-content="建议" tag-type="" style="color: #181818 !important">
      列名中只使用字母、数字（Alphanumeric characters）和下划线（Underscore）。
    </HelpTaggedEntry>
  </el-alert>
</template>

<script lang="ts" setup>
import HelpTaggedEntry from '@/components/data-wrangler/HelpTaggedEntry.vue'
</script>

<style scoped></style>
