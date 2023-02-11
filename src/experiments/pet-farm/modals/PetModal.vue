<template>
  <Modal @close="modals.close(id)">
    <div class="flex flex-col">
      <img :src="pet.img" />
      <OutlinedTextfield
          v-model="pet.name"
          autoselect
      >
        Name
      </OutlinedTextfield>
      <p>{{ pet.currentAction.name }}</p>
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
import { pets } from '@/experiments/pet-farm'
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  uid: {
    type: Number,
    required: true,
  }
})

const pet = computed(() => pets.value[props.uid])

const modals = useModals()
</script>