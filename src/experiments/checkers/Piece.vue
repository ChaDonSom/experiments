<template>
  <div
      :class="{
        'bg-stone-700 border-stone-400': color == 'black',
        'bg-red-700 border-red-400': color == 'red',
        'border-2': true,
      }"
      :style="{
        height: `${squareSize * 0.95}px`,
        width: `${squareSize * 0.95}px`,
        borderRadius: '50%',
      }"
      :data-piece-id="id"
      :data-player="color"
      :data-color="color"
  ></div>
</template>

<script lang="ts" setup>
import { inject, type PropType, type Ref } from 'vue';

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

const squareSize = inject('squareSize') as Ref<number>
</script>