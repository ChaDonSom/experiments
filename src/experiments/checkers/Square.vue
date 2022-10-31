<template>
  <div
      :class="{ 'bg-stone-500': thisIsPossibleSpace, 'bg-stone-300': !thisIsPossibleSpace }"
      class="border border-stone-600 flex items-center justify-center"
      style="width: 12.5%; height: 100%;"
  >
    <slot v-if="thisIsPossibleSpace"></slot>
  </div>
</template>

<script lang="ts" setup>
import { isPossibleSpace } from '@/experiments/checkers';
import { computed } from 'vue';

const props = defineProps({
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  }
})

const thisIsPossibleSpace = computed(() => isPossibleSpace(props.row, props.col))
</script>