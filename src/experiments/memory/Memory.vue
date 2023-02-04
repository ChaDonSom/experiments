<script lang="ts" setup>
import MemoryCard from './MemoryCard.vue'
import { shuffledCards } from './'
import { useModals } from '@/store/modals'
import { markRaw, onMounted } from 'vue'
import SettingsModal from '@/experiments/memory/modals/SettingsModal.vue'
import IconButton from '@/core/buttons/IconButton.vue'
import { useIconsStore } from '@/experiments/memory/icons'

const modals = useModals()
function openSettingsModal() {
  modals.open({ modal: markRaw(SettingsModal) })
}

const icons = useIconsStore()
onMounted(() => icons.getIcons())
</script>

<template>
  <div>
    <div class="fixed flex items-center justify-center bottom-2 z-10">
      <IconButton @click="openSettingsModal">settings</IconButton>
    </div>
    <div class="flex flex-wrap">
      <MemoryCard
          v-for="card of shuffledCards"
          :key="card.place"
          :card="card"
      />
    </div>
  </div>
</template>