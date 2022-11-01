<template>
  <div
      class="border-2 flex items-center justify-center"
      :class="{
        'bg-stone-700 border-stone-400 text-stone-900': color == 'black',
        'bg-red-700 border-red-400 text-red-900': color == 'red',
      }"
      :style="{
        height: `${squareSize * 0.95}px`,
        width: `${squareSize * 0.95}px`,
        borderRadius: '50%',
      }"
      :data-piece-id="id"
      :data-player="color"
      :data-color="color"
  >
    <i v-if="isKing" class="material-icons text-6xl">star</i>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, type PropType, type Ref } from 'vue'
import { piecesThatAreKings } from '@/experiments/checkers'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  color: {
    type: String as PropType<'red'|'black'>,
    required: true,
  }
})

const isKing = computed(() => piecesThatAreKings.value[props.id])

const squareSize = inject('squareSize') as Ref<number>
</script>