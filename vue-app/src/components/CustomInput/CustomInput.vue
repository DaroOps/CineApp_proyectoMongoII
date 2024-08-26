<template>
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      :placeholder="placeholder"
      v-model="searchQuery"
      @input="onInput"
      @keyup.enter="handleEnter"
    >
    <span class="search-icon">
      <IconBar/>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import IconBar from '@icons/nav/IconBar.vue'

const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: false
  },
  searchFunction: {
    type: Function,

  },
})

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')

const placeholder = computed(() => {
  return props.isHomePage ? "Search movie, cinema, genre..." : "Search for movies, actors, genres..."
})

const onInput = () => {
  if (!props.isHomePage) {
    handleEnter(searchQuery.value)
  }
}

const handleEnter = async () => {
  console.log("enter");
  
  if (props.isHomePage || route.path === '/app/home') {
    await props.searchFunction(searchQuery.value)
    router.push(`/app/browse/${encodeURIComponent(searchQuery.value)}`)
  } else {
    console.log("search", searchQuery.value);
    
     await props.searchFunction(searchQuery.value)
  }
}

watch(
  () => route.params.query,
  (newQuery) => {
    if (newQuery) {
      searchQuery.value = decodeURIComponent(newQuery)
    }
  }
)

// Inicializar searchQuery con el valor de la ruta al montar el componente
onMounted(() => {
  if (route.params.query) {
    searchQuery.value = decodeURIComponent(route.params.query)
  }
})
</script>

  <style lang ="scss" scoped>
  .search-container {
    position: relative;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
    padding: 15px 15px 15px 40px;
    border-radius: 10px;
    border: 0;
    outline: rgba(var(--text-color-rgb), 0.7) 1px solid;
    background: var(--background-linear);
    color: var(--text-color-rgb);
    font-size: 14px;
  }
  
  .search-input::placeholder {
    color: var(--text-color);
  }

  .search-input:focus{
    outline: rgba(var(--text-color-rgb), 0.7) 1px solid;
   }

  
  .search-icon {
    position: absolute;
    width: 14px;
    height: auto;
    left: 15px;
    top: 52%;
    transform: translateY(-50%);
    color: var(--text-color-rgb/70%);
  }
  </style>