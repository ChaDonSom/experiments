import { useLocalStorage, useMouse, useTransition, useWebWorkerFn, useWindowSize } from "@vueuse/core"
import { computed, ref, markRaw, reactive } from "vue"
import apiAxios from '@/core/utilities/axios'
import { useModals } from "@/store/modals"
import PetModal from '@/experiments/pet-farm/modals/PetModal.vue'

export const pets = ref<{ [key: number]: ReturnType<typeof usePet> }>({})

export const settings = useLocalStorage('somero-experiments-pet-farm-settings', {
    debugDirection: false,
    debugFrontFeelers: false,
    debugBackFeelers: false,
    debugTooCloseTooFar: false,
})

let _uuid = 0
export function uuid() {
  const x = _uuid
  _uuid++
  return x
}
export const maxPets = 50
export function newPet() {
  if (Object.keys(pets.value).length >= maxPets) return
  const uid = uuid()
  pets.value[uid] = usePet(uid)
}
export function reset() {
    pets.value = {}
    for (let i = 0; i < maxPets; i++) newPet()
}

const { x, y, } = useMouse()
const { height, width } = useWindowSize()
const modals = useModals()

type Point = { x: number, y: number }

/**
 * Get a new pet
 * @param uid a unique number, unique to the page
 */
export function usePet(uid: number) {
    const position = ref({ x: (Math.random() * width.value), y: (Math.random() * height.value) })
    const movementModifier = ref(1)
    const name = ref('')
    // apiAxios.get('/api/pet-farm/name').then(response => name.value = response.data)
    const img = ref(`https://api.dicebear.com/5.x/fun-emoji/svg?seed=${uid}&radius=50`)
    const direction = ref({ x: (Math.random() * 2) + -1, y: (Math.random() * 2) + -1 })
    const momentum = ref(1)

    const distance = 40
    const feelerRadius = 40
    const leftward = computed(() => degrees(direction.value) - 45)
    const rightward = computed(() => degrees(direction.value) + 45)
    const rearRight = computed(() => degrees(direction.value) + 135)
    const rearLeft = computed(() => degrees(direction.value) - 135)
    const leftFeeler = computed(() => ({ x: position.value.x + (vector(radians(leftward.value)).x * distance), y: position.value.y + (vector(radians(leftward.value)).y * distance) }))
    const rightFeeler = computed(() => ({ x: position.value.x + (vector(radians(rightward.value)).x * distance), y: position.value.y + (vector(radians(rightward.value)).y * distance) }))
    const rearRightFeeler = computed(() => ({ x: position.value.x + (vector(radians(rearRight.value)).x * distance), y: position.value.y + (vector(radians(rearRight.value)).y * distance) }))
    const rearLeftFeeler = computed(() => ({ x: position.value.x + (vector(radians(rearLeft.value)).x * distance), y: position.value.y + (vector(radians(rearLeft.value)).y * distance) }))

    function showModal() {
        modals.open({ modal: markRaw(PetModal), props: { uid } })
    }

    const tooClose = 30
    const tooFar = 90

    return reactive({
        uid,
        name,
        img,
        position,
        direction,
        tooClose,
        tooFar,
        pInDirection: computed(() => ({ x: position.value.x + (direction.value.x * 20), y: position.value.y + (direction.value.y * 20) })),
        showModal,
        leftward,
        rightward,
        leftFeeler,
        rightFeeler,
        momentum,
        movementModifier,
        rearRight,
        rearLeft,
        rearRightFeeler,
        rearLeftFeeler,
        feelerRadius,
    })
}

const movementInterval = () => {
    for (const key in pets.value) {
        const pet = pets.value[key]
        // Bounce
        if ((pet.position.x > width.value && pet.direction.x >= 0)) pet.position.x = 0
        else if ((pet.position.x < 0 && pet.direction.x < 0)) pet.position.x = width.value
        if ((pet.position.y > height.value && pet.direction.y >= 0)) pet.position.y = 0
        else if ((pet.position.y < 0 && pet.direction.y < 0)) pet.position.y = height.value

        // Nudge direction for testing
        // direction.value = vector(radians(degrees(direction.value) - 5))

        // Check nearby
        let nudge = degrees(pet.direction)
        let sees = false
        for (const key of Object.keys(pets.value).filter(k => Number(k) != pet.uid)) {
            if (sees) continue
            const otherPet = pets.value[Number(key)]
            // let seesLeft = false
            // let seesRight = false
            // let seesRearLeft = false
            // let seesRearRight = false
            // let seesRear = false
            // let seesFore = false
            if (pointIsInRadius(otherPet.position, pet.position, pet.tooFar)) sees = true
            // if (pointIsInRadius(otherPet.position, pet.leftFeeler, pet.feelerRadius)) sees = seesFore = seesLeft = true
            // if (pointIsInRadius(otherPet.position, pet.rightFeeler, pet.feelerRadius)) sees = seesFore = seesRight = true
            // if (pointIsInRadius(otherPet.position, pet.rearLeftFeeler, pet.feelerRadius)) sees = seesRear = seesRearLeft = true
            // if (pointIsInRadius(otherPet.position, pet.rearRightFeeler, pet.feelerRadius)) sees = seesRear = seesRearRight = true
            
            const distToOther = distance(pet.position, otherPet.position)
            
            const directionDifference = degrees(otherPet.direction) - degrees(pet.direction)
            if (sees && distToOther < pet.tooClose) {
                // const awayFromThem = degrees(direction(pet.position, otherPet.position)) + 180
                // const awayFromThemDifference = awayFromThem - degrees(pet.direction)
                // nudge += (awayFromThemDifference * 0.5)
            }
            if (sees && distToOther >= pet.tooClose && distToOther < pet.tooFar) {
                const towardThem = degrees(direction(pet.position, otherPet.position))
                const towardThemDifference = towardThem - degrees(pet.direction)
                nudge += (directionDifference * 0.1) + (towardThemDifference * 0.1)
            }
            if (sees) {
                // If directions are close enough to each other, speed up to get closer to one that's ahead, slow down 
                // to get further away from one that's ahead.
                // Right now this makes the boids go crazy fast
                const petDeg = degrees(pet.direction)
                const otherPetDeg = degrees(otherPet.direction)
                if (((360 + (otherPetDeg - petDeg)) % 360) < 45) {
                    // Figure out if otherPet is in front or behind
                    const angle = petDeg - degrees(direction(pet.position, otherPet.position))
                    const isInFront = (angle >= 0 && angle <= 90) || (angle >= 270 && angle <= 360) 
                    if (isInFront && distToOther < pet.tooClose) pet.momentum -= 1
                    if (isInFront && distToOther >= pet.tooClose && distToOther < pet.tooFar) pet.momentum += 1
                }
            }

            // if ((seesLeft || seesRearLeft) && distToOther < pet.tooClose) nudge += (directionDifference * 0.1)
            // if ((seesLeft || seesRearLeft) && distToOther >= pet.tooClose && distToOther < pet.tooFar) nudge -= (directionDifference * 0.1)
            // if ((seesRight || seesRearRight) && distToOther < pet.tooClose) nudge -= (directionDifference * 0.1)
            // if ((seesRight || seesRearRight) && distToOther >= pet.tooClose && distToOther < pet.tooFar) nudge += (directionDifference * 0.1)

            // if (sees && distToOther < pet.tooClose) {
            //     if (seesLeft) nudge += (10 * directionDifferenceModifier)
            //     if (seesRight) nudge -= (10 * directionDifferenceModifier)
            // }
            // if (sees && seesFore && distToOther < pet.tooClose) pet.momentum -= 0.1
            // if (sees && seesFore && distToOther >= pet.tooClose && distToOther < pet.tooFar) pet.momentum += 0.1
            // if (sees && seesRear && distToOther < pet.tooClose) pet.momentum += 0.1
            // if (sees && seesRear && distToOther >= pet.tooClose && distToOther < pet.tooFar) pet.momentum -= 0.1
            // if (sees) {
            //     // If directions are close enough to -180 of each other, turn quickly
            //     const petDeg = (360 + (degrees(pet.direction) - 180)) % 360
            //     const otherPetDeg = degrees(otherPet.direction)
            //     if (((360 + (otherPetDeg - petDeg)) % 360) < 45) {
            //         if (seesLeft) nudge += 10
            //         if (seesRight) nudge -= 10
            //     }
            // }

            if (!sees) pet.momentum -= 0.1
            const minimumMomentum = 1
            if (!sees && pet.momentum < minimumMomentum) pet.momentum = minimumMomentum
        }
        pet.direction = vector(radians(nudge))

        // Move
        pet.position.x += (pet.direction.x * (pet.momentum * pet.movementModifier))
        pet.position.y += (pet.direction.y * (pet.momentum * pet.movementModifier))
    }

    requestAnimationFrame(movementInterval)
}
movementInterval()

function pointIsWithin(point: Point, corners: { topLeft: Point, bottomRight: Point }): boolean {
    return point.x > corners.topLeft.x && point.x < corners.bottomRight.x && point.y > corners.topLeft.y && point.y < corners.bottomRight.y
}

function pointIsInRadius(point: Point, point2: Point, radius: number) {
    return distance(point, point2) < radius
}

const degrees = ({ x, y }: Point) => (360 + Math.round((180 * Math.atan2(y, x))/Math.PI)) % 360
const radians = (deg: number) => (deg * Math.PI) / 180.0
const vector = (rad: number) => ({ x: Math.cos(rad), y: Math.sin(rad) })
const distance = (p1: Point, p2: Point): number => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
const direction = (p1: Point, p2: Point) => ({ x: p2.x - p1.x, y: p2.y - p1.y })