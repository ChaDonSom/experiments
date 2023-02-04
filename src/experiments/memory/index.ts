import { useStorage, watchOnce, whenever } from "@vueuse/core"
import { defineStore } from "pinia"
import { ref, computed, type Ref, watch, reactive } from "vue"

export function Card(place: number) {
    const internalPlace = ref(place)
    const copy: Ref<1|2> = ref(internalPlace.value >= (numberOfCards.value / 2) ? 2 : 1)
    const internalRevealed = ref(false)
    const matched = ref(false)
    const value = computed(() => {
        return copy.value == 2 ? internalPlace.value - (numberOfCards.value / 2) : internalPlace.value
    })
    function toggleRevealed() {
        if (otherRevealedCards.value.length < 2 && !internalRevealed.value) {
            internalRevealed.value = !internalRevealed.value
        } else {
            internalRevealed.value = false
        }
    }
    const otherRevealedCards = computed(() => {
        return revealedCards.value.filter(card => card.place != internalPlace.value)
    })
    const otherMatchingRevealedCards = computed(() => {
        return otherRevealedCards.value.filter(card => card.value == value.value)
    })
    whenever(
        () => internalRevealed.value,
        () => {
            if (otherRevealedCards.value.length) {
                setTimeout(() => revealedCards.value.forEach(card => card.toggleRevealed()), 1000)
            }
            if (otherMatchingRevealedCards.value.length) {
                matched.value = true
                otherMatchingRevealedCards.value.forEach(card => card.matched = true)
            }
        }
    )
    const inPlay = computed(() => !matched.value ? true : internalRevealed.value)
    return reactive({
        place: internalPlace,
        copy,
        revealed: computed(() => internalRevealed.value),
        toggleRevealed,
        matched,
        value,
        inPlay,
    })
}
export enum DisplayOption {
    'number' = 'number',
    'material-icons' = 'material-icons',
}
export const display = useStorage<DisplayOption>('somero-experiments-memory-display', DisplayOption.number)
export const numberOfCards = useStorage('somero-experiments-memory-number-of-cards', 30)
export const cards = computed(() => (new Array(numberOfCards.value)).fill(1).map((v, i) => Card(i)))
export const shuffledCards = computed(() => [...cards.value].sort((a, b) => Math.random() > 0.5 ? 1 : -1))
export const revealedCards = computed(() => cards.value.filter(card => card.revealed))
export const countRevealedCards = computed(() => Object.keys(revealedCards.value).length)
export function reset() {
    const carry = numberOfCards.value
    numberOfCards.value = 0
    numberOfCards.value = carry
}

const memoryStore = defineStore('memory', () => ({
    display,
    numberOfCards,
    cards,
    shuffledCards,
    revealedCards,
    countRevealedCards,
    reset,
}))

memoryStore()