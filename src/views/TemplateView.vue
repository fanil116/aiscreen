<template>
  <div>
    <img :src="data.preview_image" :alt="data.name" class="template__image"/>
    <div class="template__name">{{data.name}}</div>
    <div class="form">
      Edit template
      <form @submit.prevent="submit">
        <div>
          <label for="name">Enter name: </label>
          <input v-model="templateName" type="text" name="name" id="name" required />
        </div>
        <div>
          <label for="tags">Enter tags: </label>
          <input v-model="templateTagsStrings" type="text" name="tegs" id="tags" required />
        </div>
        <div>
          <label for="width">Enter width: </label>
          <input v-model="templateWidth" type="number" name="width" id="width" required />
        </div>
        <div>
          <label for="height">Enter height: </label>
          <input v-model="templateHeight" type="number" name="height" id="height"  required/>
        </div>
        <div>
          <label for="image">Choose  picture:</label>
          <input type="file" id="image" name="image" accept="image/png, image/jpeg" @change="uploadImage"/>
        </div>
         <button>Отправить</button>
      </form>
    </div>
  </div>
</template>

<script>
  import {computed, ref} from "vue";
  import { useRoute } from 'vue-router';
  import axios from "axios";
  import { useUserStore } from "../stores/user";
  import { useErrorStore } from "../stores/error"
  export default {
    name: "TemplateView",

    setup() {
      const route = useRoute()
      const users = useUserStore();
      const errors = useErrorStore();
      let data = ref({});
      let templateName = ref("");
      let templateTagsStrings = ref("");
      let templateWidth = ref(0);
      let templateHeight = ref(0);
      let templateId = route.query.id;
      let selectedFile = null;
      const token = computed(() => {
        return users?.getUser?.token || JSON.parse(localStorage.getItem("User")).token;
    })
      const getCurrentTemplate = function() {
        axios.get(`https://dev-api.aiscreen.io/api/v1/canvas_templates/${templateId}`,{
        headers:{
          "authorization": `Bearer ${token.value}`
          }
      }).then((response) => {
        Object.assign(data.value,response.data);
        templateName.value = data.value.name;
        templateWidth.value = data.value.width;
        templateHeight.value = data.value.height;
        templateTagsStrings.value = data.value.tags.join(", ");
      })
      }

      function uploadImage(event) {
      selectedFile = event.target.files[0];
      }

      const submit = async function() {
        if (templateWidth.value<=0 || templateHeight.value <= 0) {
          errors.setErrorText("Ширина и высота должны быть больше 0");
          errors.setVisibleError(true)
          return;
        }
        const formData = new FormData();
        formData.append('name', templateName.value);
        formData.append('width', templateWidth.value);
        formData.append('height', templateHeight.value);
        const templateTags = templateTagsStrings.value.split(/[, ]+/g).filter(tag => tag.trim().length > 0);
        templateTags.forEach(tag => formData.append('tags[]', tag));
        if (selectedFile) {
          formData.append('image', selectedFile);
        } 
        try {
          await axios.post(`https://dev-api.aiscreen.io/api/v1/canvas_templates/${data.value.id}?_method=PATCH`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "authorization": `Bearer ${token.value}`
            }
        });
      } catch (error) {
        errors.setErrorText(error.message);
        errors.setVisibleError(true);
      }
    }

      getCurrentTemplate();
      return {data, templateWidth, templateHeight, templateTagsStrings, templateName, uploadImage, submit}
    }
  }

</script>
<style scoped>
  .template__image {
    width: 100%;
  }
</style>
