<script lang="ts" setup>
import { useModals } from '@/store/modals'
import { computed, markRaw, onMounted, reactive, ref } from 'vue'
import SettingsModal from '@/experiments/boids/modals/SettingsModal.vue'
import IconButton from '@/core/buttons/IconButton.vue'
import { newPet, pets, reset, settings, usePet, uuid } from '@/experiments/boids'
import Pet from '@/experiments/boids/Boid.vue'

const modals = useModals()
function openSettingsModal() {
  modals.open({ modal: markRaw(SettingsModal) })
}

reset()
</script>

<template>
  <div class="h-screen w-screen">
    <div class="fixed flex items-center justify-center bottom-2 z-10">
      <IconButton @click="reset()">replay</IconButton>
      <IconButton @click="openSettingsModal()">settings</IconButton>
    </div>
    <Pet v-for="pet of pets" :key="pet.uid" :pet="pet" />
    <svg style="position: fixed; width: 100vw; height: 100vh;">
      <template v-if="settings.debugDirection">
        <line
            v-for="pet of pets"
            :key="pet.uid"
            :x1="pet.position.x" :y1="pet.position.y" :x2="pet.pInDirection.x" :y2="pet.pInDirection.y" stroke="red"
        />
      </template>
      <template v-if="settings.debugTooCloseTooFar">
        <circle
            v-for="pet of pets" :key="pet.uid"
            :cx="pet.position.x" :cy="pet.position.y" :r="pet.tooClose" stroke="red" fill-opacity="0"
        />
        <circle
            v-for="pet of pets" :key="pet.uid"
            :cx="pet.position.x" :cy="pet.position.y" :r="pet.tooFar" stroke="pink" fill-opacity="0"
        />
      </template>
    </svg>
    <!-- <div
            v-for="pet of pets"
            :key="pet.uid"
      class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
      :style="{ transform: `translateX(${pet.leftCorners.topLeft.x}px) translateY(${pet.leftCorners.topLeft.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
      class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
      :style="{ transform: `translateX(${pet.leftCorners.topLeft.x}px) translateY(${pet.leftCorners.bottomRight.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
        class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
        :style="{ transform: `translateX(${pet.leftCorners.bottomRight.x}px) translateY(${pet.leftCorners.bottomRight.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
        class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
        :style="{ transform: `translateX(${pet.leftCorners.bottomRight.x}px) translateY(${pet.leftCorners.topLeft.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
      class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
      :style="{ transform: `translateX(${pet.rightCorners.topLeft.x}px) translateY(${pet.rightCorners.topLeft.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
      class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
      :style="{ transform: `translateX(${pet.rightCorners.topLeft.x}px) translateY(${pet.rightCorners.bottomRight.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
        class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
        :style="{ transform: `translateX(${pet.rightCorners.bottomRight.x}px) translateY(${pet.rightCorners.bottomRight.y}px)` }"
    ></div>
    <div
            v-for="pet of pets"
            :key="pet.uid"
        class="h-2 w-2 rounded-full fixed top-0 left-0 bg-orange-500"
        :style="{ transform: `translateX(${pet.rightCorners.bottomRight.x}px) translateY(${pet.rightCorners.topLeft.y}px)` }"
    ></div> -->
  </div>
</template>