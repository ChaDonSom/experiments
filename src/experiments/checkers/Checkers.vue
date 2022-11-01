<template>
  <div
      ref="mainRef"
      class="flex items-center justify-center w-screen h-screen"
  >
    <div class="bg-stone-100" :style="boardStyle">
      <div v-for="(row, index) of board" :id="String(index)" class="flex" style="height: 12.5%;">
        <Square
            v-for="column of row"
            :row="index"
            :col="column"
            @drag-started="onDragStarted"
        >
          <Piece
              v-if="piecesCurrentPlaces[`${index}${column}`]"
              :id="piecesCurrentPlaces[`${index}${column}`]"
              :color="piecesCurrentPlaces[`${index}${column}`][0] <= 2 ? 'black' : 'red'"
              :class="{
                'brightness-150': (checkersSettings.highlightPieces && spacesThatCanMove[`${index}${column}`])
              }"
          />
        </Square>
      </div>
    </div>

    <div class="fixed top-3 left-2 flex items-center">
      {{ score.black }}
      <IconButton v-if="checkersSettings.activePlayer == 'black'" v-tooltip="`Black's turn`">expand_less</IconButton>
    </div>

    <div
        class="fixed flex items-center justify-center"
        :class="{
          'flex-col justify-center': screenIsHorizontal,
          'bottom-2': !screenIsHorizontal,
          'left-2': screenIsHorizontal,
        }"
    >
      <IconButton @click="openSettingsModal">settings</IconButton>
      <IconButton @click="checkersSettings.running = !checkersSettings.running">
        {{ checkersSettings.running ? 'pause' : 'play_arrow' }}
      </IconButton>
      <IconButton @click="resetGame">replay</IconButton>
    </div>

    <div class="fixed bottom-3 left-2 flex items-center">
      {{ score.red }}
      <IconButton v-if="checkersSettings.activePlayer == 'red'" v-tooltip="`Red's turn`">expand_more</IconButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { board, useBoard, piecesCurrentPlaces, resetGame, useBoardStore, spacesThatCanMove, score } from "@/experiments/checkers"
import { computed, markRaw, provide, ref } from "vue"
import Piece from "./Piece.vue"
import Square from "./Square.vue"
import Button from "@/core/buttons/Button.vue"
import { useWindowSize } from "@vueuse/core"
import { useModals } from "@/store/modals"
import SettingsModalVue from "@/experiments/checkers/modals/SettingsModal.vue"
import IconButton from "@/core/buttons/IconButton.vue"
import { checkersSettings } from "@/experiments/checkers"

const boardStore = useBoardStore()

const mainRef = ref<HTMLElement|null>(null)

const {
  boardStyle,
  squareSize
} = useBoard(mainRef)

provide('squareSize', squareSize)

const {
  height,
  width
} = useWindowSize()
const screenIsHorizontal = computed(() => width.value >= height.value)

const modals = useModals()
function openSettingsModal() {
  modals.open({ modal: markRaw(SettingsModalVue) })
}

function onDragStarted() {
  
}
</script>