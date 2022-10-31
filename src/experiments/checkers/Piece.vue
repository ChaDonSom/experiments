<template>
  <div
      ref="mainRef"
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
  ></div>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core';
import { inject, ref, type PropType, type Ref } from 'vue';

const props = defineProps({
  color: {
    type: String as PropType<'red'|'black'>,
    required: true,
  }
})

const squareSize = inject('squareSize') as Ref<number>

const mainRef = ref<HTMLElement|null>(null)
const { style } = useDraggable(mainRef)
</script>