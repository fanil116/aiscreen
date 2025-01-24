import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errors', {
    state: () => ({
        error: null,
        visibleError: false
    }),

    getters: {
        getErrorText: (state) => state.error,
        getErrorVisible: (state) => state.visibleError
    },

    actions: {
        setErrorText(data) {
            this.error = data;
        },
        setVisibleError(data) {
            this.visibleError = data
        }
    }
})
