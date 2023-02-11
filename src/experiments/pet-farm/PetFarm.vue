<script lang="ts" setup>
import { useModals } from '@/store/modals'
import { computed, markRaw, onMounted, reactive, ref } from 'vue'
import SettingsModal from '@/experiments/pet-farm/modals/SettingsModal.vue'
import IconButton from '@/core/buttons/IconButton.vue'
import { pets, usePet } from '@/experiments/pet-farm'
import Pet from '@/experiments/pet-farm/Pet.vue'

const modals = useModals()
function openSettingsModal() {
  modals.open({ modal: markRaw(SettingsModal) })
}

let _uuid = 0
function uuid() {
  const x = _uuid
  _uuid++
  return x
}
function newPet() {
  if (Object.keys(pets.value).length >= 10) return
  const uid = uuid()
  pets.value[uid] = usePet(uid)
}

</script>

<template>
  <div class="h-screen w-screen" @click="newPet">
    <div class="fixed flex items-center justify-center bottom-2 z-10">
      <IconButton @click="openSettingsModal">settings</IconButton>
    </div>
    <!-- <div class="h-12 w-12 rounded-full fixed bg-green-600" :style="{ top: `${y}px`, left: `${x}px` }"></div> -->
    <Pet v-for="pet of pets" :key="pet.uid" :pet="pet" />
  </div>
</template>