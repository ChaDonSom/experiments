import axios from 'axios'
import { defineStore } from 'pinia'

export const useIconsStore = defineStore({
    id: 'icons',
    state: () => ({
        icons: [] as string[]
    }),
    getters: {
        // doubleCount: (state) => state.counter * 2
    },
    actions: {
        async getIcons() {
            const codepoints = await axios.get("https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints")
            console.log('codepoints: ', codepoints)
            this.icons = codepoints.data.split('\n')
                .map((line: any) => line.split(' ')[0])
                .sort(() => Math.random() > 0.5 ? 1 : -1)
        }
    }
})
