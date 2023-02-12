import { useMouse, useTransition, useWebWorkerFn, useWindowSize } from "@vueuse/core"
import { computed, ref, markRaw, reactive } from "vue"
import apiAxios from '@/core/utilities/axios'
import { useModals } from "@/store/modals"
import PetModal from '@/experiments/pet-farm/modals/PetModal.vue'

export const pets = ref<{ [key: number]: ReturnType<typeof usePet> }>({})

export function reset() { pets.value = {} }

const { x, y, } = useMouse()
const { height, width } = useWindowSize()
const modals = useModals()

/**
 * Get a new pet
 * @param uid a unique number, unique to the page
 */
export function usePet(uid: number) {
    const position = ref({ x: x.value, y: y.value })
    const positionAsArray = computed({
        get: () => [position.value.x, position.value.y],
        set: v => {
            position.value.x = v[0]
            position.value.y = v[1]
        }
    })
    const movementModifier = ref(Math.random())
    const transition = useTransition(positionAsArray, {
        duration: 10000 * movementModifier.value,
    })
    const name = ref('')
    apiAxios.get('/api/pet-farm/name').then(response => name.value = response.data)
    const img = ref(`https://api.dicebear.com/5.x/fun-emoji/svg?seed=${uid}&radius=50`)

    function exploreRandomly() {
        const { workerFn: updatePosition, workerStatus } = useWebWorkerFn((width: number, height: number) => {
            const xChange = Math.random() * width
            const yChange = Math.random() * height
            return { x: xChange, y: yChange }
        })
        const movementInterval = setInterval(() => {
            requestAnimationFrame(async () => {
                if (workerStatus.value == 'RUNNING') return
                position.value = await updatePosition(width.value, height.value)
            })
        }, 5000)
        function stop() { clearInterval(movementInterval) }
        const done = ref(false)
        setTimeout(() => {
            done.value = true
            stop()
        }, Math.random() * 60000)

        return reactive({
            name: 'Explore randomly',
            stop,
            done,
        })
    }
    function visitAnother() {
        const anotherToVisit = pets.value[Number(pickRandomFromArray(Object.keys(pets.value).filter(i => {
            return Number(i) != uid
        })))]
        const friendliness = ref(Math.random() * 100)
        const { workerFn: updatePosition, workerStatus } = useWebWorkerFn((x: number, y: number, friendliness: number) => {
            const xChange = x + ((Math.random() + -0.5) * friendliness)
            const yChange = y + ((Math.random() + -0.5) * friendliness)
            return { x: xChange, y: yChange }
        })
        const movementInterval = setInterval(() => {
            requestAnimationFrame(async () => {
                if (workerStatus.value == 'RUNNING') return
                position.value = await updatePosition(anotherToVisit.transition[0], anotherToVisit.transition[1], friendliness.value)
            })
        }, 1000)
        function stop() { clearInterval(movementInterval) }
        const done = ref(anotherToVisit ? false : true)
        setTimeout(() => {
            done.value = true
            stop()
        }, Math.random() * 60000)

        return reactive({
            name: `Visit ${anotherToVisit?.name || ''}`,
            stop,
            done,
        })
    }
    function hungry() {
        function stop() {
            done.value = true
            currentAction.value = pickRandomAction()()
        }
        const done = ref(false)

        return reactive({
            name: `Hungry`,
            stop,
            done,
        })
    }
    const actions: (() => { name: string, stop: () => void, done: boolean })[] = [
        exploreRandomly,
        visitAnother,
        hungry,
    ]
    const currentAction = ref(pickRandomAction()())
    function pickRandomAction() {
        return pickRandomFromArray(actions)
    }
    function pickRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }
    setInterval(() => {
        if (currentAction.value.done) currentAction.value = pickRandomAction()()
    }, 5000)

    function showModal() {
        modals.open({ modal: markRaw(PetModal), props: { uid } })
    }

    return reactive({
        uid,
        name,
        img,
        currentAction,
        position,
        transition,
        showModal,
    })
}