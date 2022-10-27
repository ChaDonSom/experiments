import { useLocalStorage } from "@vueuse/core"

export const playerCount = useLocalStorage<number>('phaser-player-count', 1)

export const bombType = useLocalStorage<string>(
    "phaser-bomb-type",
    "bomb"
)

export const canDoubleJump = useLocalStorage<boolean>('phaser-can-double-jump', true)

export const canBodySlam = useLocalStorage<boolean>('phaser-can-body-slam', true)