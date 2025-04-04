<script setup lang="ts">
  import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <router-view></router-view>
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
</style>
