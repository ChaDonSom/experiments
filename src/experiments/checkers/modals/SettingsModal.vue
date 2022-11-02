<template>
  <Modal @close="modals.close(id)">
    <div class="flex flex-col">
      <MdcSwitch v-model="checkersSettings.highlightPieces">Highlight available pieces</MdcSwitch>
      <MdcSwitch v-model="checkersSettings.highlightMoves">Highlight available moves</MdcSwitch>
      <MdcSwitch v-model="checkersSettings.highlightMovesWhileDragging">Highlight available moves while dragging</MdcSwitch>
      <MdcSwitch v-model="checkersSettings.forceJumps">Force players to jump if they can</MdcSwitch>
      <p class="my-3 italic">Not implemented yet</p>
      <MdcSwitch disabled v-model="checkersSettings.forceCommits" class="text-gray-500 italic">Force players to use a piece if they start dragging it</MdcSwitch>
      <MdcSwitch disabled v-model="checkersSettings.allowMultipleJumps" class="text-gray-500 italic">Allow multiple jumps</MdcSwitch>
      <MdcSwitch disabled v-model="checkersSettings.clickMode" class="text-gray-500 italic">Click mode</MdcSwitch>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/core/modals/Modal.vue'
import { useModals } from '@/store/modals'
import MdcSwitch from '@/core/switches/MdcSwitch.vue'
import { checkersSettings } from '@/experiments/checkers'
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const modals = useModals()

onMounted(() => checkersSettings.value.running = false)
onBeforeUnmount(() => checkersSettings.value.running = true)
</script>