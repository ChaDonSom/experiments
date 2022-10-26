import { useLocalStorage } from "@vueuse/core"

export const playerCount = useLocalStorage<number>('phaser-player-count', 1)

export const bombType = useLocalStorage<string>(
    "phaser-bomb-type",
    "bomb"
);