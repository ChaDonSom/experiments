<template>
  <div
      ref="mainRef"
      :class="{
        'bg-stone-500': thisIsPossibleSpace,
        'bg-stone-300': !thisIsPossibleSpace,
        'bg-stone-400': (isDragging ? (checkersSettings.highlightMovesWhileDragging && thisIsAvailableSpaceForDrag) : (checkersSettings.highlightMoves && availableSpaces.includes(id)))
      }"
      class="border border-stone-600 flex items-center justify-center"
      style="width: 12.5%; height: 100%;"
      :data-id="id"
  >
    <slot v-if="thisIsPossibleSpace"></slot>
  </div>
</template>

<script lang="ts" setup>
import { isPossibleSpace, emitter, piecesCurrentPlaces, checkersSettings, playerForPieceId, availableSpaces, spacesThatCanMove, score, piecesThatAreKings, spacesThatCanJump } from '@/experiments/checkers'
import { getNumbersFromPlace, placeBetweenPlaces } from "@/experiments/checkers/board"
import { computed, ref, watch, provide, toRef, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'

const props = defineProps({
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits([
  'drag-started',
  'drag-ended'
])

const id = computed(() => `${props.row}${props.col}`)

const thisIsPossibleSpace = computed(() => isPossibleSpace(props.row, props.col))

const mainRef = ref<HTMLElement|null>(null)
type DragStarted = {
  row: number,
  col: number,
  pieceId: string,
  availableMoves: string[],
}
const sortable = ref<Sortable|null>(null)
watch(
  () => [mainRef.value, spacesThatCanMove.value[id.value], checkersSettings.value],
  () => {
    if (mainRef.value) {
      if (sortable.value) sortable.value.destroy()
      sortable.value = new Sortable(mainRef.value, {
        group: {
          name: "pieces",
          pull: () => !!spacesThatCanMove.value[id.value],
          put: () => thisIsAvailableSpaceForDrag.value
        },
        animation: 350,
        disabled: !checkersSettings.value.running
          || (piecesCurrentPlaces.value[id.value] && !spacesThatCanMove.value[id.value])
          || (piecesCurrentPlaces.value[id.value] && (checkersSettings.value.forceJumps && Object.keys(spacesThatCanJump.value).length) && !spacesThatCanMove.value[id.value].jumpOptions.length),
        onStart(event) {
          event.item.style.zIndex = '10'
          let player = event.item.dataset.player
          let availableMoves = checkersSettings.value.forceJumps && spacesThatCanJump.value[id.value] ? spacesThatCanMove.value[id.value]?.jumpOptions : spacesThatCanMove.value[id.value]?.moveOptions
          emitter.emit('drag-started', {
            row: props.row,
            col: props.col,
            pieceId: event.item.dataset.pieceId,
            player,
            availableMoves,
          } as DragStarted)
        },
        onEnd(event) {
          emitter.emit('drag-ended')
        },
        onAdd(event) {
          let previousSpace = event.from.dataset.id
          if (!previousSpace) return
          let prevExploded = getNumbersFromPlace(previousSpace)
          let nextExploded = getNumbersFromPlace(id.value)
          let isMoreThanOneJump = Math.abs(nextExploded[0] - prevExploded[0]) > 1 && Math.abs(nextExploded[1] - prevExploded[1]) > 1
          if (isMoreThanOneJump) {
            let placeBetween = placeBetweenPlaces(previousSpace, id.value)
            delete piecesCurrentPlaces.value[placeBetween]
            score.value[checkersSettings.value.activePlayer]++
          }

          let pieceId = event.item.dataset.pieceId
          piecesCurrentPlaces.value[id.value] = pieceId
          // Make king
          if (pieceId
            && (
              (id.value[0] == '0' && checkersSettings.value.activePlayer == 'red')
                || (id.value[0] == '7' && checkersSettings.value.activePlayer == 'black')
            )
          ) {
            piecesThatAreKings.value[pieceId] = true
          }

          // If forceJumps && another jump is available, keep current player

          // If not forceJumps, and allowMultipleJumps, and another jump is available... the game must hand the turn management over to the players
          // Unless we count it by the 'onMove' of the sortables vvv
          
          checkersSettings.value.activePlayer = checkersSettings.value.activePlayer == 'black' ? 'red' : 'black'
        },
        onRemove(event) {
          delete piecesCurrentPlaces.value[id.value]
        },
        onMove(evt) {
          // See if there are any _more_ jumps to move. If so, add them to .availableJumps now,
          // also remove them if we move to a different place
        }
      })
    }
  },
  { deep: true, immediate: true }
)

const isDragging = ref(false)
const thisIsAvailableSpaceForDrag = ref(false)
function onDragStarted(payload: DragStarted) {
  isDragging.value = true
  if (payload.availableMoves.includes(id.value)) {
    thisIsAvailableSpaceForDrag.value = true
  } else {
    thisIsAvailableSpaceForDrag.value = false
  }
}
emitter.on('drag-started', onDragStarted)
function onDragEnded() {
  isDragging.value = false
  thisIsAvailableSpaceForDrag.value = false
}
emitter.on('drag-ended', onDragEnded)
onBeforeUnmount(() => {
  emitter.off('drag-started', onDragStarted)
  emitter.off('drag-ended', onDragEnded)
})

provide('row', toRef(props, 'row'))
provide('col', toRef(props, 'col'))
</script>