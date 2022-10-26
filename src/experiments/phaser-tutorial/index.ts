import { useLocalStorage } from "@vueuse/core"

export const playerCount = useLocalStorage<number>('phaser-player-count', 1)