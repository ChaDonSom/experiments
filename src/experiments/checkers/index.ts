import { getNumbersFromPlace, placeContinuingInLine } from "@/experiments/checkers/board"
import { useModals } from "@/store/modals"
import { useElementBounding, useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { TinyEmitter } from "tiny-emitter"
import { computed, markRaw, ref, watch, type Ref } from "vue"
import WinModal from "@/experiments/checkers/modals/WinModal.vue"

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
            if (piecesThatAreKings.value[occupied]) availableRows.push(index - advance)
            let availableCols = [col + 1, col - 1]
            let moveOptions = []
            let jumpOptions = []
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
                    let placeBeyondJump = placeContinuingInLine(`${index}${col}`, `${rowOption}${colOption}`)
                    if (!placeBeyondJump) continue
                    let [rowBeyondJump, colBeyondJump] = getNumbersFromPlace(placeBeyondJump)
                    if (rowBeyondJump >= board.value.length || rowBeyondJump < 0) continue
                    if (colBeyondJump >= board.value[0].length || colBeyondJump < 0) continue
                    let beyondJumpOptionOccupied = piecesCurrentPlaces.value[placeBeyondJump]
                    if (!beyondJumpOptionOccupied) {
                        moveOptions.push(placeBeyondJump)
                        jumpOptions.push(placeBeyondJump)
                        continue
                    }
                }
            }
            if (moveOptions.length) {
                acc[`${index}${col}`] = { moveOptions, jumpOptions }
            }
            return acc
        }, {} as { [key: string]: { moveOptions: string[], jumpOptions: string[] } })
        acc = {
            ...acc,
            ...colsThatCanMove,
        }
        return acc
    }, {} as { [key: string]: { moveOptions: string[], jumpOptions: string[] } })
})

export const spacesThatCanJump = computed(() => {
    let result = JSON.parse(JSON.stringify(spacesThatCanMove.value))
    for (let key in result) {
        if (!result[key].jumpOptions.length) delete result[key]
    }
    return result
})

export const availableSpaces = computed(() => {
    return Object.values(spacesThatCanMove.value).map(i => (checkersSettings.value.forceJumps && Object.keys(spacesThatCanJump.value).length) ? i.jumpOptions : i.moveOptions).flat().filter((value, index, self) => self.indexOf(value) == index)
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

export const piecesThatAreKings = useLocalStorage('experiments-checkers-king-pieces-v1', {

} as { [key: string]: true })

export function playerForPieceId(id: string): 'red'|'black' {
    return Number(id[0]) <= 2 ? 'black' : 'red'
}

export async function resetGame() {
    const modals = useModals()
    try {
        await modals.confirm("Are you sure?")
    } catch {
        return
    }
    piecesCurrentPlaces.value = JSON.parse(JSON.stringify(piecesStartingPlaces.value))
    piecesThatAreKings.value = {}
    checkersSettings.value.activePlayer = 'black'
    score.value.black = 0
    score.value.red = 0
}

export const checkersSettings = useLocalStorage('checkers-settings-v5', {
    running: true,
    activePlayer: 'black' as 'red'|'black',
    forceJumps: false,
    allowMultipleJumps: false,
    forceCommits: false,
    clickMode: false,
    highlightMoves: false,
    highlightMovesWhileDragging: true,
    highlightPieces: false,
})

export const score = useLocalStorage('experiments-checkers-score-v1', {
    black: 0,
    red: 0
})

export const winning = computed(() => {
    if (score.value.black > score.value.red) return 'black'
    if (score.value.red > score.value.black) return 'red'
    else return null
})

watch(
    () => spacesThatCanMove.value,
    () => {
        if (!Object.keys(spacesThatCanMove.value).length) {
            const modals = useModals()    
            modals.open({ modal: markRaw(WinModal) })
        }
    },
    { immediate: true }
)

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
    score,
    piecesThatAreKings,
    spacesThatCanJump,
}))