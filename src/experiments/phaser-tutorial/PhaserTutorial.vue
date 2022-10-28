<template>
  <div class="w-screen h-screen">
    <RouterView />
    <CircularScrim :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import CircularScrim from '@/core/loaders/CircularScrim.vue';
import { onMounted, provide, ref } from 'vue';

const route = useRoute()
const router = useRouter()

if (route.matched.length == 1) router.replace({ name: 'phaser-tutorial-start' })

const loading = ref(true)
onMounted(() => setTimeout(() => loading.value = false))
provide('loading', loading)
</script>

<style scoped lang="scss">
@use "@/css/mdc-theme";
@use "@material/typography";
@include typography.core-styles;
</style>
