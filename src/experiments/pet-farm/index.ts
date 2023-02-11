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
    const name = ref('')
    apiAxios.get('/api/pet-farm/name').then(response => name.value = response.data)
    const img = ref(`https://api.dicebear.com/5.x/fun-emoji/svg?seed=${uid}&radius=50`)

    const { workerFn: updatePosition, workerStatus } = useWebWorkerFn((x: number, y: number, width: number, height: number) => {
        const xChange = Math.random() * width
        const yChange = Math.random() * height
        return { x: xChange, y: yChange }
    })
    const movementInterval = setInterval(() => {
        requestAnimationFrame(async () => {
            if (workerStatus.value == 'RUNNING') return
            position.value = await updatePosition(position.value.x, position.value.y, width.value, height.value)
        })
    }, 300)
    const transition = useTransition(positionAsArray, {
        duration: 10000 * movementModifier.value,
    })

    function showModal() {
        modals.open({ modal: markRaw(PetModal), props: { uid } })
    }

    return reactive({
        uid,
        name,
        img,
        position,
        transition,
        movementInterval,
        showModal,
    })
}