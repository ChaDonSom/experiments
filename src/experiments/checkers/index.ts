import { useElementBounding } from "@vueuse/core"
import { computed, ref, type Ref } from "vue"

export const board = ref([
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
])
export const possibleSpaces = ref([[0, 2, 4, 6], [1, 3, 5, 7]])
export function isPossibleSpace(row: number, column: number): boolean {
    return row % 2 != 0 ? possibleSpaces.value[0].includes(column) : possibleSpaces.value[1].includes(column)
}

export function useBoard(boardRef: Ref<HTMLElement|null>) {
    const {
        height: mainRefHeight,
        width: mainRefWidth
    } = useElementBounding(boardRef)
    const minimumDimension = computed(() => {
        return (mainRefHeight.value > mainRefWidth.value) ? mainRefWidth.value : mainRefHeight.value
    })
    const boardStyle = computed(() => {
    let result = {} as { [key: string]: any }
        result.width = result.height = `${minimumDimension.value}px`
        return result
    })
    const squareSize = computed(() => minimumDimension.value / 8)

    return {
        minimumDimension,
        boardStyle,
        squareSize,
    }
}