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

    <h3 class="text-sm m-auto">
      High score for these settings: {{ highScores[highScoreLocalStorageKey] ?? 'none yet' }}
    </h3>
    <Transition name="opacity-0-scale-097-150ms">
      <div class="mt-10 flex flex-col justify-center" v-if="leaderboardData">
        <h2 class="text-base font-bold m-auto mb-3">Leaderboard</h2>
        <!-- <DataTable>
          <template #header>
            <DataTableHeaderCell>Players</DataTableHeaderCell>
            <DataTableHeaderCell>Bomb type</DataTableHeaderCell>
            <DataTableHeaderCell>Allow double jump</DataTableHeaderCell>
            <DataTableHeaderCell>Allow body slam</DataTableHeaderCell>
          </template>
          <template #body>
            <DataTableRow v-for="row of leaderboardData.rows">
              <DataTableCell numeric>{{ row.players }}</DataTableCell>
              <DataTableCell>{{ row.bomb_type }}</DataTableCell>
              <DataTableCell>{{ row.allow_double_jump }}</DataTableCell>
              <DataTableCell>{{ row.allow_body_slam }}</DataTableCell>
            </DataTableRow>
          </template>
        </DataTable> -->
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/core/buttons/Button.vue"
import {
  playerCount, bombType, canDoubleJump, canBodySlam, highScores, highScoreLocalStorageKey
} from "@/experiments/phaser-tutorial"
import { useRouter } from "vue-router";
import Select from "@/core/selects/OutlinedSelect.vue"
import SelectOption from "@/core/selects/SelectOption.vue"
import MdcSwitch from "@/core/switches/MdcSwitch.vue"
import { inject, onMounted, ref, type Ref } from "vue";
import axios from "axios";
import DataTable from "../../core/tables/DataTable.vue";
import DataTableHeaderCell from "../../core/tables/DataTableHeaderCell.vue";
import DataTableCell from "../../core/tables/DataTableCell.vue";
import DataTableRow from "../../core/tables/DataTableRow.vue";

const router = useRouter()

const loading = inject('loading') as Ref<boolean>
async function goToPhaserGame() {
  loading.value = true
  await router.push({ name: 'phaser-tutorial-game' })
  location.reload()
}

const leaderboardData = ref<{ [key: string]: any }|null>(null)
onMounted(async () => {
  // leaderboardData.value = (await axios.get('/api/phaser-tutorial/leaderboard')).data
})
</script>

<style lang="scss" scoped>
@use "@/css/transitions";
</style>