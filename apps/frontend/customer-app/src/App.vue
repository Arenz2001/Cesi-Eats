<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
