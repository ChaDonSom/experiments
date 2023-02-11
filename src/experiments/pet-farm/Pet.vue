<template>
<div
    :key="pet.uid"
    class="h-12 w-12 rounded-full fixed"
    :style="{ transform: `translateX(${pet.transition[1]}px) translateY(${pet.transition[0]}px)` }"
    @click="pet.showModal"
>
  <img
      :src="pet.img"
      alt="avatar"
  />
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