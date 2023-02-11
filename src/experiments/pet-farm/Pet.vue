<template>
<div
    :key="pet.uid"
    class="h-12 w-12 rounded-full fixed top-0 left-0"
    :style="{ transform: `translateX(${pet.transition[0]}px) translateY(${pet.transition[1]}px)` }"
    @click.stop="pet.showModal"
>
  <p class="text-xs whitespace-nowrap overflow-visible">{{ pet.name }}</p>
  <img
      :src="pet.img"
      alt="avatar"
  />
  <p class="text-xs whitespace-nowrap overflow-visible">{{ pet.currentAction.name }}</p>
</div>
</template>

<script lang="ts" setup>
defineProps({
  pet: {
    type: Object,
    required: true,
  }
})
</script>