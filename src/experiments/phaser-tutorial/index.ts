import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { computed } from "vue"

export const playerCount = useLocalStorage<number>('phaser-tutorial-player-count', 1)

export const bombType = useLocalStorage<string>(
    "phaser-tutorial-bomb-type",
    "bomb"
)

export const canDoubleJump = useLocalStorage<boolean>('phaser-tutorial-can-double-jump', true)

export const canBodySlam = useLocalStorage<boolean>('phaser-tutorial-can-body-slam', true)

export const highScoreLocalStorageKey = computed(() => (
    `phaser-tutorial-high-score-${playerCount.value}-${bombType.value}-${canDoubleJump.value}-${canBodySlam.value}`
))

export const highScores = useLocalStorage('phaser-tutorial-high-scores', {
    [highScoreLocalStorageKey.value]: 0
})

export const usePhaserTutorial = defineStore('phaserTutorial', () => ({
    playerCount,
    bombType,
    canDoubleJump,
    canBodySlam,
    highScoreLocalStorageKey,
    highScores,
}))