<template>
  <Modal @close="modals.close(id)">
    <div class="flex flex-col">
      <OutlinedTextfield
          type="number"
          :model-value="numberOfCards / 2"
          @change:model-value="numberOfCards = Number($event) * 2"
          autoselect
      >
        Number of matches
      </OutlinedTextfield>
      <OutlinedSelect :label="'Display'" v-model="display" class="mb-32">
        <SelectOption :model-value="DisplayOption.number">Number</SelectOption>
        <SelectOption :model-value="DisplayOption['material-icons']">Material icons</SelectOption>
        <SelectOption :model-value="DisplayOption['foxes']">Foxes</SelectOption>
      </OutlinedSelect>
      <Button @click="reset()"><template #leading-icon>replay</template>Reset</Button>
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
import { display, numberOfCards, reset, DisplayOption } from '@/experiments/memory'
import OutlinedSelect from '@/core/selects/OutlinedSelect.vue'
import SelectOption from '@/core/selects/SelectOption.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const modals = useModals()
</script>