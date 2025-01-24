<template>
    <div class="templates">
        <div v-if="filteredTemplates && filteredTemplates.length > 0" v-for="(template, index) in filteredTemplates" :key="index">
            <CanvasTemplate :template="template"/>
        </div>
        <div v-else>Шаблоны отсуствуют</div>
    </div>
</template>
<script>
  import {computed, watch, ref} from "vue"
  import { useTemplatesStore } from "../stores/templates"
  import CanvasTemplate from "../components/CanvasTemplate.vue";
  export default {
    name: "CanvasTemplates",
    components: {
        CanvasTemplate
    },
    props: ["checkedTags"],
    setup(props) {
        const templatesStore = useTemplatesStore();
        const templates = computed(() => {
          return templatesStore.getTemplates;
        })
        const filteredTemplates = computed(() => {
            if (props.checkedTags.length > 0) {
                return templates.value.filter((template) => {
                    return template.tags.some((tag) => props.checkedTags.includes(tag));
                });
            } else {
                return templates.value
            }
        });
        return {filteredTemplates}
    }
  }
</script>
<style scoped>
.templates {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}
</style>