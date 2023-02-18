<template>
<div
    :key="pet.uid"
    class="h-6 w-6 rounded-full fixed -top-3 -left-3"
    :style="{ transform: `translateX(${pet.position.x}px) translateY(${pet.position.y}px)` }"
    @click.stop="pet.showModal"
>
  <p class="text-xs whitespace-nowrap overflow-visible">{{ pet.name }}</p>
  <img
      :src="pet.img"
      alt="avatar"
  />
  <!-- <p class="text-xs whitespace-nowrap overflow-visible">{{ pet.currentAction.name }}</p> -->
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