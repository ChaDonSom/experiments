<template>
  <div
      ref="mainRef"
      :class="{
        'bg-stone-500 z-10': thisIsPossibleSpace,
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
import { isPossibleSpace, emitter, piecesCurrentPlaces, checkersSettings, playerForPieceId, availableSpaces, spacesThatCanMove } from '@/experiments/checkers'
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
  () => [mainRef.value, spacesThatCanMove.value[id.value]],
  () => {
    if (mainRef.value) {
      if (sortable.value) sortable.value.destroy()
      sortable.value = new Sortable(mainRef.value, {
        group: {
          name: "pieces",
          pull: () => !!spacesThatCanMove.value[id.value],
          put: () => thisIsAvailableSpaceForDrag.value
        },
        animation: 200,
        disabled: piecesCurrentPlaces.value[id.value] && !spacesThatCanMove.value[id.value],
        onStart(event) {
          let player = event.item.dataset.player
          let availableMoves = spacesThatCanMove.value[id.value]
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
          piecesCurrentPlaces.value[id.value] = event.item.dataset.pieceId
          checkersSettings.value.activePlayer = checkersSettings.value.activePlayer == 'black' ? 'red' : 'black'
        },
        onRemove(event) {
          delete piecesCurrentPlaces.value[id.value]
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

provide('row', toRef(props.row))
provide('col', toRef(props.col))
</script>