<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    //RouterLink,
    RouterView,
  },
  data() {
    return {
      // You can add any reactive data properties here if needed
    }
  },
  methods: {
    // You can add methods here if needed
  },
})
</script>

<template>
  <div id="app-container">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/main.css';
#app-container {
  max-width: 1200px; /* Limits the max width of your game content */
  width: 100%;
  min-height: 100vh; /* Ensures the container takes full viewport height */
  margin: 0 auto; /* Centers the container horizontally */
  padding: var(--spacing-lg); /* Padding around the main content */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally within the container */
  justify-content: center; /* Center content vertically within the container */
}
</style>
