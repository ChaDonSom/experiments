<template>
  <div
      class="m-10"
      ref="mainRef"
  >
    <h1 class="text-lg my-5">Experiments</h1>
    <div class="flex flex-wrap gap-10">
      <RouterLink
          :to="{ name: 'phaser-tutorial-start' }"
          @click="loading = true"
          class="mdc-ripple overflow-hidden"
      >
        <div class="inline-flex flex-col bg-slate-500 rounded-xl items-center justify-center p-3">
          <div class="inline-flex w-12 h-12 items-center justify-center">
            <img
                class="object-cover w-8 h-11"
                src="/images/experiments/phaser-tutorial/dude.png"
            />
          </div>
          <h2 class="text-slate-100 text-center">Phaser Tutorial</h2>
        </div>
      </RouterLink>
      <RouterLink
          :to="{ name: 'checkers' }"
          @click="loading = true"
          class="mdc-ripple overflow-hidden"
      >
        <div class="inline-flex flex-col bg-slate-500 rounded-xl items-center justify-center p-3">
          <div class="inline-flex w-12 h-12 items-center justify-center">
            <img
                class="object-cover rounded-xl"
                src="/images/experiments/checkers/checkers-logo.png"
            />
          </div>
          <h2 class="text-slate-100 text-center">Checkers</h2>
        </div>
      </RouterLink>
      <RouterLink
          :to="{ name: 'memory' }"
          @click="loading = true"
          class="mdc-ripple overflow-hidden"
      >
        <div class="inline-flex flex-col bg-slate-500 rounded-xl items-center justify-center p-3">
          <div class="inline-flex w-12 h-12 items-center justify-center text-slate-100">
            <i class="material-icons">lightbulb</i>
          </div>
          <h2 class="text-slate-100 text-center">Memory</h2>
        </div>
      </RouterLink><RouterLink
          :to="{ name: 'pet-farm' }"
          @click="loading = true"
          class="mdc-ripple overflow-hidden"
      >
        <div class="inline-flex flex-col bg-slate-500 rounded-xl items-center justify-center p-3">
          <div class="inline-flex w-12 h-12 items-center justify-center text-slate-100">
            <img
                class="object-cover rounded-xl"
                src="https://api.dicebear.com/5.x/fun-emoji/svg?seed=sidufhoihsud&radius=50"
            />
          </div>
          <h2 class="text-slate-100 text-center">Pet farm</h2>
        </div>
      </RouterLink>
    </div>
    <CircularScrim :loading="loading" />
  </div>
</template>

<script lang="ts" setup>
import CircularScrim from '@/core/loaders/CircularScrim.vue'
import { MDCRipple } from '@material/ripple';
import { provide, ref, watch } from 'vue';

const loading = ref(false)

provide('loading', loading)

const mainRef = ref<HTMLElement|null>(null)
watch(
  () => mainRef.value,
  () => {
    if (mainRef.value) {
      let ripples = mainRef.value.querySelectorAll('.mdc-ripple')
      ripples.forEach(ripple => new MDCRipple(ripple))
    }
  }
)
</script>

<style lang="scss" scoped>
@use "@material/ripple";

.mdc-ripple {
  @include ripple.surface;
  @include ripple.radius-bounded;
  @include ripple.states;
}
</style>