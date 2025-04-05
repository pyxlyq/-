<script setup lang="ts">
  import { watch } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // 监听路由变化，滚动到顶部
  watch(
    () => route.path,
    () => {
      window.scrollTo(0, 0)
    }
  )
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #app {
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .app-container {
    height: 100%;
  }

  /* 页面过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
