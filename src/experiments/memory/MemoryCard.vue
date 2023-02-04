<script lang="ts" setup>
import { display, DisplayOption, type Card } from '@/experiments/memory'
import { computed, onMounted, ref, type PropType, type Ref } from 'vue'
import { useMotion } from '@vueuse/motion'
import { useIconsStore } from '@/experiments/memory/icons'

const props = defineProps({
  card: {
    type: Object as PropType<ReturnType<typeof Card>>,
    required: true,
  }
})

const classes = computed(() => ({
  "bg-blue-500": props.card.revealed && props.card.matched
}))

const icons = useIconsStore()
</script>

<template>
  <template v-if="card.inPlay">
    <div
        v-if="!card.revealed"
        class="h-32 w-20 rounded-xl bg-slate-300 m-3 text-slate-900 flex items-center justify-center"
        :class="classes"
        @click="card.toggleRevealed"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0
        }"
    >
    </div>
    <div
        v-else
        class="h-32 w-20 rounded-xl bg-slate-300 m-3 text-slate-900 flex items-center justify-center"
        :class="classes"
        @click="card.toggleRevealed"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0
        }"
    >
      <i v-if="display == DisplayOption['material-icons']" class="material-icons">{{ icons.icons[card.value] }}</i>
      <span v-else-if="display == DisplayOption.number">{{ card.value }}</span>
    </div>
  </template>
  <template v-else>
    <div class="h-32 w-20 m-3"></div>
  </template>
</template>