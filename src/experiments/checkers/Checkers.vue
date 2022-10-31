<template>
  <div class="flex items-center justify-center w-screen h-screen" ref="mainRef">
    <div class="bg-stone-100" :style="boardStyle">
      <div v-for="(row, index) of board" :id="String(index)" class="flex" style="height: 12.5%;">
        <Square
            v-for="column of row"
            :row="index"
            :col="column"
        >
          <Piece v-if="index < 3" color="black" />
          <Piece v-else-if="index >= 5" color="red" />
        </Square>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { board, isPossibleSpace, useBoard } from "@/experiments/checkers"
import { computed, provide, ref } from "vue"
import Piece from "./Piece.vue"
import Square from "./Square.vue"

const mainRef = ref<HTMLElement|null>(null)

const {
  boardStyle,
  squareSize
} = useBoard(mainRef)

provide('squareSize', squareSize)
</script>