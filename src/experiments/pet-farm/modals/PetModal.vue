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
      <IconButton
          v-if="pet.currentAction.name == 'Hungry' && !pet.currentAction.done"
          @click="pet.currentAction.stop"
      >restaurant</IconButton>
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
import IconButton from '@/core/buttons/IconButton.vue'
import { onMounted } from 'vue'
import { until, watchOnce, whenever } from '@vueuse/core'

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

onMounted(async () => {
  await until(() => pet.value)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(pet.value.name))
  }
})
</script>