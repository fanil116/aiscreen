<template>
    <div class="template">
        <img :src="image" :alt="name" class="template__image"/>
        <div class="template__name">{{name}}</div>
        <div class="template__wrapper">
            <button @click="editTemplate">Редактировать</button>
            <button @click="deleteTemplate">Удалить</button>
        </div>
    </div>
</template>
<script>
    import {computed} from "vue";
    import axios from "axios";
    import { useUserStore } from "../stores/user"
    import { useRouter } from 'vue-router'
    export default {
        name: "CanvasTemplate",
        props: ['template'],
        setup(props) {
            let name = props.template.name
            let image = props.template.preview_image
            const users = useUserStore();
            const router = useRouter()
            const token = computed(() => {
                return users?.getUser?.token || JSON.parse(localStorage.getItem("User")).token;
            })

            const editTemplate = function() {
                router.push({ path: '/template', query: {id: props.template.id} })
            }

            const deleteTemplate = function() {
                axios.delete("https://dev-api.aiscreen.io/api/v1/canvas_templates",{
                    headers:{
                        "authorization": `Bearer ${token.value}`
                    },
                    data: {
                        "id": props.template.id
                    }
                })
            }
         return {name, image, editTemplate, deleteTemplate}
    }
  }
</script>
<style scoped>
.template {
    border: 2px solid black;
}
.template__image {
    width: 400px;
    height: 300px;
}
</style>