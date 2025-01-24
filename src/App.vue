<template>
  <RouterView />
  <div class="modal" v-if="errorVisible">
    {{errorText}}
    <button @click="close">Close</button>
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router';
import { useErrorStore } from "./stores/error";
import {computed} from "vue";
export default {
   setup() {
    const errors = useErrorStore();
    
    const errorText = computed(() => {
        return errors.getErrorText
    })
    const errorVisible= computed(() => {
        return errors.getErrorVisible
    })

    const close = function() {
      errors.setVisibleError(false)
    }

    return {errorText, errorVisible, close}
   }
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 10%;
  left: 35%;
  background: black;
  color: white;
  width: 400px;
  height:auto

}
</style>
