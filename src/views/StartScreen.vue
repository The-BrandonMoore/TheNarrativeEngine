<template>
  <div class="start-screen">
    <h1>Welcome, Adventurer</h1>
    <p>
      Prepare yourself. For Azerim finds iteslf in peril. Only you are equipped to save the world
      from darkness.
    </p>
    <button class="start-button">Start New Game</button>
    <button class="load-button">Load Saved Game</button>

    <img src="@/assets/logo.svg" alt="App Logo" class="start-screen__logo" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'StartScreen',
})
</script>

<style scoped>
/* Scoped styles only apply to this component */
.start-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--spacing-lg) * 2); /* Adjust based on App.vue padding */
  text-align: center;
  padding: var(--spacing-lg);
}

.start-screen h1 {
  font-family: var(--font-family-display); /* Use a more prominent font */
  font-size: var(--font-size-xl);
  color: var(--color-accent-gold);
  margin-bottom: var(--spacing-lg);
}

.start-screen p {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  line-height: 1.8;
}

.start-button,
.load-button {
  background-color: var(--color-accent-bronze); /* Use your accent color */
  color: var(--color-text-primary);
  border: 2px solid var(--color-accent-gold); /* Gold border */
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
  font-family: var(--font-family-heading);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.1s ease;
  margin: var(--spacing-sm);
}

.start-button:hover,
.load-button:hover {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary); /* Text becomes black on hover */
  border-color: var(--color-accent-bronze);
  transform: translateY(-2px);
}

.start-button:active,
.load-button:active {
  transform: translateY(0);
  background-color: var(--color-accent-bronze);
}
</style>
