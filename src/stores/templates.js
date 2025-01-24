import { defineStore } from 'pinia'

export const useTemplatesStore = defineStore('templates', {
    state: () => ({
        templates: null
    }),

    getters: {
        getTemplates: (state) => state.templates,
    },

    actions: {
        setTemplates(data) {
            this.templates = data;
        }
    }
})
