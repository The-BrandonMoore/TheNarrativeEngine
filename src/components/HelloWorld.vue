<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HelloWorld',

  props: {
    msg: {
      type: String,
      default: 'Hello Vue 3 + Vite',
    },
  },
}
</script>

<style scoped></style>
