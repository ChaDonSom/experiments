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
  >
    <slot v-if="thisIsPossibleSpace"></slot>
  </div>
</template>

<script lang="ts" setup>
import { isPossibleSpace, emitter, piecesCurrentPlaces, checkersSettings, playerForPieceId, availableSpaces } from '@/experiments/checkers'
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
  availableRows: number[],
  availableCols: number[]
}
const sortable = ref<Sortable|null>(null)
watch(
  () => [mainRef.value, piecesCurrentPlaces.value[id.value]],
  () => {
    if (mainRef.value) {
      if (sortable.value) sortable.value.destroy()
      sortable.value = new Sortable(mainRef.value, {
        disabled: piecesCurrentPlaces.value[id.value] && playerForPieceId(piecesCurrentPlaces.value[id.value]) != checkersSettings.value.activePlayer,
        onStart(event) {
          let player = event.item.dataset.player
          let availableRows = [(player == 'black' ? props.row + 1 : props.row - 1)]
          // if king, [props.row + 1, props.row - 1]
          let availableCols = [props.col - 1, props.col + 1] // diagonal move - regardless of player or king
          emitter.emit('drag-started', {
            row: props.row,
            col: props.col,
            pieceId: event.item.dataset.pieceId,
            player: event.item.dataset.player,
            availableRows,
            availableCols,
          })
        },
        onEnd(event) {
          emitter.emit('drag-ended')
        }
      })
    }
  },
  { deep: true }
)

const isDragging = ref(false)
const thisIsAvailableSpaceForDrag = ref(false)
function onDragStarted(payload: DragStarted) {
  isDragging.value = true
  if (
    payload.availableRows.includes(props.row)
    && payload.availableCols.includes(props.col)
    && !piecesCurrentPlaces.value[id.value]
  ) {
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

provide('row', toRef(props.row))
provide('col', toRef(props.col))
</script>