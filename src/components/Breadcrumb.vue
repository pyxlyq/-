<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      <router-link v-if="index < breadcrumbs.length - 1" :to="item.path">
        {{ item.title }}
      </router-link>
      <span v-else>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const breadcrumbs = computed(() => {
    const matched = route.matched.filter(item => item.meta && item.meta.title)
    return matched.map(item => ({
      path: item.path,
      title: item.meta.title as string
    }))
  })
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
  }
</style>
