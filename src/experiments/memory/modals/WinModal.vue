<template>
  <Modal @close="modals.close(id)">
    <div class="flex flex-col">
      <p class="my-3 italic text-xl">{{ winningFormatted }} wins!</p>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/core/modals/Modal.vue'
import { useModals } from '@/store/modals'
import { checkersSettings, winning } from '@/experiments/checkers'
import { computed, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const modals = useModals()

const winningFormatted = computed(() => winning.value ? winning.value[0].toUpperCase() + winning.value.slice(1) : '')

onMounted(() => checkersSettings.value.running = false)
onBeforeUnmount(() => checkersSettings.value.running = true)
</script>