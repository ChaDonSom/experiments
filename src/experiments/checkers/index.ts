import { useElementBounding, useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { TinyEmitter } from "tiny-emitter"
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

export const spacesThatCanMove = computed(() => {
    let rows = board.value
    return rows.reduce((acc, row, index) => {
        let colsThatCanMove = row.reduce((acc, col) => {
            let id = `${index}${col}`
            let occupied = piecesCurrentPlaces.value[id]
            if (!occupied) return acc
            let player = playerForPieceId(occupied)
            if (player != checkersSettings.value.activePlayer) return acc
            let advance = player == 'black' ? +1 : -1 // if occupied == king, advance can be both
            let availableRows = [index + advance]
            if (false /* king */) availableRows.push(index - advance)
            let availableCols = [col + 1, col - 1]
            let moveOptions = []
            for (let rowOption of availableRows) {
                for (let colOption of availableCols) {
                    let idOption = `${rowOption}${colOption}`
                    if (rowOption >= board.value.length || rowOption < 0) continue
                    if (colOption >= board.value[0].length || colOption < 0) continue
                    let optionOccupied = piecesCurrentPlaces.value[idOption]
                    if (!optionOccupied) {
                        moveOptions.push(idOption)
                        continue
                    }
                    let optionPlayer = playerForPieceId(optionOccupied)
                    if (optionPlayer == player) continue
                    let rowBeyondJump = index + ((rowOption - index) * 2)
                    let colBeyondJump = col   + ((colOption - col)   * 2)
                    if (rowBeyondJump >= board.value.length || rowBeyondJump < 0) continue
                    if (colBeyondJump >= board.value[0].length || colBeyondJump < 0) continue
                    let spaceBeyondJump = `${rowBeyondJump}${colBeyondJump}`
                    let beyondJumpOptionOccupied = piecesCurrentPlaces.value[spaceBeyondJump]
                    if (!beyondJumpOptionOccupied) {
                        moveOptions.push(spaceBeyondJump)
                        continue
                    }
                }
            }
            if (moveOptions.length) {
                acc[`${index}${col}`] = moveOptions
            }
            return acc
        }, {} as { [key: string]: string[] })
        acc = {
            ...acc,
            ...colsThatCanMove,
        }
        return acc
    }, {} as { [key: string]: string[] })
})

export const availableSpaces = computed(() => {
    return Object.values(spacesThatCanMove.value).flat().filter((value, index, self) => self.indexOf(value) == index)
})

export const piecesStartingPlaces = ref({
    '01': '01', '03': '03', '05': '05', '07': '07',
    '10': '10', '12': '12', '14': '14', '16': '16',
    '21': '21', '23': '23', '25': '25', '27': '27',
    '50': '50', '52': '52', '54': '54', '56': '56',
    '61': '61', '63': '63', '65': '65', '67': '67',
    '70': '70', '72': '72', '74': '74', '76': '76'
})

export const piecesCurrentPlaces = useLocalStorage(
    'checkers-current-places',
    JSON.parse(JSON.stringify(piecesStartingPlaces.value))
)

export function playerForPieceId(id: string): 'red'|'black' {
    return Number(id[0]) <= 2 ? 'black' : 'red'
}

export function resetGame() {
    piecesCurrentPlaces.value = JSON.parse(JSON.stringify(piecesStartingPlaces.value))
    checkersSettings.value.activePlayer = 'black'
}

export const checkersSettings = useLocalStorage('checkers-settings-v4', {
    running: true,
    activePlayer: 'black' as 'red'|'black',
    forceJumps: false,
    forceCommits: false,
    clickMode: false,
    highlightMoves: false,
    highlightMovesWhileDragging: true,
    highlightPieces: false,
})

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

export const emitter = new TinyEmitter()

export const useBoardStore = defineStore('board', () => ({
    board,
    possibleSpaces,
    spacesThatCanMove,
    piecesStartingPlaces,
    piecesCurrentPlaces,
    checkersSettings,
    availableSpaces,
}))