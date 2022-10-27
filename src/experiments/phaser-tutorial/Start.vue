<template>
  <div class="m-10 flex items-center justify-center flex-col">
    <div class="flex w-12 h-12 items-center justify-center">
      <img class="object-cover w-6 h-8 scale-150" src="/images/experiments/phaser-tutorial/dude.png" />
    </div>

    <div>
      <Select label="Players" v-model="playerCount">
        <SelectOption :model-value="1">1 player</SelectOption>
        <SelectOption :model-value="2">2 players</SelectOption>
      </Select>
    </div>

    <div>
      <Select label="Bomb type" v-model="bombType">
        <SelectOption :model-value="'bomb'">Normal</SelectOption>
        <SelectOption :model-value="'google'">Google</SelectOption>
        <SelectOption :model-value="'dude'">Dude</SelectOption>
      </Select>
    </div>

    <div>
      <MdcSwitch v-model="canDoubleJump" label="Allow double jumping" />
    </div>

    <div>
      <MdcSwitch v-model="canBodySlam" label="Allow body slamming" />
    </div>

    <Button @click="goToPhaserGame">Start</Button>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/core/buttons/Button.vue"
import { playerCount, bombType, canDoubleJump, canBodySlam } from "@/experiments/phaser-tutorial"
import { useRouter } from "vue-router";
import Select from "@/core/selects/OutlinedSelect.vue"
import SelectOption from "@/core/selects/SelectOption.vue"
import MdcSwitch from "@/core/switches/MdcSwitch.vue"

const router = useRouter()

async function goToPhaserGame() {
  await router.push({ name: 'phaser-tutorial-game' })
  location.reload()
}
</script>