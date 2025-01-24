<template>
  <main>
    <div class="wrapper">
      <div class="form">
      Add template
      <form  @submit.prevent="submit">
        <div>
          <label for="name">Enter name: </label>
          <input v-model="templateName" type="text" name="name" id="name" required />
        </div>
        <div>
          <label for="tags">Enter tags: </label>
          <input v-model="templateTagsStrings" type="text" name="tegs" id="tags"  required/>
        </div>
        <div>
          <label for="width">Enter width: </label>
          <input v-model="templateWidth" type="number" name="width" id="width"  required/>
        </div>
        <div>
          <label for="height">Enter height: </label>
          <input v-model="templateHeight" type="number" name="height" id="height" required />
        </div>
        <div>
          <label for="image">Choose  picture:</label>
          <input type="file" id="image" name="image" accept="image/png, image/jpeg" @change="uploadImage"/>
        </div>
         <button>Отправить</button>
    </form>
    </div>
    <div class="filter">
      Фильтрация
      <div v-for="(tag, index) in tags" :key="index">
        <input type="checkbox" :id="tag" :value="tag" v-model="checkedTags" />
        <label :for="tag">{{ tag }}</label>
      </div>
    </div>
    <div class="search">
      <input class="search__input" type="text" v-model="searchQuery" @input="onInput" placeholder="Search...">
      <div class="search__wrapper" v-if="searchResult.length >0">
        <div class="search__item" v-for="(item, index) in searchResult" :key="index">
          {{ item.name }}
        </div>
      </div>
    </div>
    </div>
    <CanvasTemplates :checkedTags="checkedTags"/>
  </main>
</template>
<script>
import axios from "axios";
import {computed, ref} from "vue";
import { useUserStore } from "../stores/user";
import { useTemplatesStore } from "../stores/templates";
import { useErrorStore } from "../stores/error";
import CanvasTemplates from "../components/CanvasTemplates.vue";
export default {
  name: "Home",
  components: {
    CanvasTemplates
  },
  setup() {
    const users = useUserStore();
    const templatesStore = useTemplatesStore();
    const errors = useErrorStore();
    let templateName = ref("");
    let templateTagsStrings = ref("");
    let templateWidth = ref(0);
    let templateHeight = ref(0);
    let selectedFile = null;
    let tags = ref(null);
    let searchQuery = ref("");
    let searchResult = ref([]);
    let timeout = null
    let checkedTags = ref([])
    const token = computed(() => {
        return users?.getUser?.token || JSON.parse(localStorage.getItem("User")).token;
    })
    const getTemplates = function() {
      axios.get("https://dev-api.aiscreen.io/api/v1/canvas_templates?page%5Bnumber%5D=1",{
        headers:{
          "authorization": `Bearer ${token.value}`
          }
      }).then((response) => {
        templatesStore.setTemplates(response.data)
      })

    }

    function uploadImage(event) {
      selectedFile = event.target.files[0];
    }


    const submit = async function() {
      if (templateWidth.value<=0 || templateHeight.value <= 0) {
          errors.setErrorText("Ширина и высота должны быть больше 0");
          errors.setVisibleError(true);
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
        await axios.post('https://dev-api.aiscreen.io/api/v1/canvas_templates', formData, {
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

    const getTemplatesTags = function () {
      axios.get("https://dev-api.aiscreen.io/api/v1/canvas_templates/tags/list",{
        headers:{
          "authorization": `Bearer ${token.value}`
          }
      }).then((response) => {
        tags.value = response.data
      })
    }

    const onInput = function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        search(searchQuery.value);
        
      }, 500);
    }
    const search = function(query) {
      if (searchQuery.value <= 0) {
        searchResult.value.length = 0
        return
      }
      axios.get(`https://dev-api.aiscreen.io/api/v1/canvas_templates/library?filter%5Bname%5D=${query}`,{
        headers:{
          "authorization": `Bearer ${token.value}`
          }
      }).then((response) => {
        searchResult.value = response.data
        
      })
    }
    const templates = computed(() => {
        return templatesStore.getTemplates;
    })

    getTemplates();
    getTemplatesTags();

    return {submit, templateTagsStrings, templateName, uploadImage, templateWidth, templateHeight, tags, checkedTags, searchQuery, onInput, searchResult}
  }
}
</script>
<style>
main {
  width: 100%;
}
.form {
  margin: 20px 0 20px 20px;
}
.wrapper {
  display: flex;
}

.search {
  margin-left: 50px;
  position: relative;
}
.search__input {
  width: 400px
}
.search__wrapper {
  border: 1px solid black;
}
.search__item {
  border-bottom: 1px solid black;
}
</style>