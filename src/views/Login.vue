<template>
  <div class="login">
    <input
        id="email"
        v-model="emailValue"
        :required="true"
        placeholder="email"
        type="email"
    />
    <label for="email"></label>
    <input
        id="password"
        v-model="passwordValue"
        :required="true"
        placeholder="password"
        type="password"
    />
    <label for="password"></label>
    <button type="submit" @click="submit">Отправить</button>
  </div>
</template>

<script>
    import {ref} from "vue"
    import axios from "axios";
     import { useUserStore } from "../stores/user"
     import { useRouter } from 'vue-router'
    export default {
        name: "Login",
        setup() {
        const users = useUserStore();
        let emailValue = ref("hello@aiscreen.io");
        let passwordValue = ref("Demo!1234");
        const router = useRouter()
        
        const submit = function() {
            axios.post('https://dev-api.aiscreen.io/api/v1/login', {
                "email": `${emailValue.value}`,
                "password": `${passwordValue.value}`,
                "remember_me": "1"
            }).then((response) => {
                users.saveUser(response.data)
                router.replace({ path: '/' })
            })
        }

        return {emailValue, passwordValue, submit}
    }}
</script>