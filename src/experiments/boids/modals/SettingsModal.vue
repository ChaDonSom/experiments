<template>
  <Modal @close="modals.close(id)">
    <div class="flex flex-col">
      <p class="my-3">Debug</p>
      <MdcSwitch v-model="settings.debugDirection">Direction</MdcSwitch>
      <MdcSwitch v-model="settings.debugTooCloseTooFar">Too close / too far</MdcSwitch>
      <MdcSwitch v-model="settings.debugOthersDirection">Average direction of others nearby</MdcSwitch>
      <MdcSwitch v-model="settings.debugOthersPosition">Average position of others nearby (center of mass)</MdcSwitch>
      <!-- <p class="my-3 italic">Not implemented yet</p> -->
      <!-- <MdcSwitch disabled class="text-gray-500 italic">Click mode</MdcSwitch> -->
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/core/modals/Modal.vue'
import { useModals } from '@/store/modals'
import MdcSwitch from '@/core/switches/MdcSwitch.vue'
import Button from '@/core/buttons/Button.vue'
import OutlinedTextfield from '@/core/fields/OutlinedTextfield.vue'
import OutlinedSelect from '@/core/selects/OutlinedSelect.vue'
import SelectOption from '@/core/selects/SelectOption.vue'
import { reset, settings } from '@/experiments/boids'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const modals = useModals()
</script>