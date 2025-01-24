import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
    state: () => ({
        user: null
    }),

    getters: {
        getUser: (state) => state.user,
    },

    actions: {
        saveUser(data) {
            this.user = data;
            localStorage.setItem("User", JSON.stringify(data));
        }
    }
})
