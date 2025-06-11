<template>
  <div class="game-over-screen">
    <div class="game-title-banner">Game Over</div>
    <h1>Your Adventure Ends Here.</h1>
    <p>You fought valiantly, but destiny had other plans.</p>

    <!-- <img
      src="/assets/images/flickering_candle.gif"
      alt="A small flickering pixel art candle"
      class="game-over-animation-gif"
    /> -->

    <button class="restart-button" @click="restartGame">Restart Game</button>
    <button class="home-button" @click="goHome">Back to Main Menu</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { useGameWorldStore } from '../stores/gameWorldStore'
import { useCombatStore } from '../stores/combatStore'

export default defineComponent({
  name: 'GameOverScreen',
  methods: {
    restartGame() {
      // Reset all relevant stores for a fresh start
      usePlayerStore().$reset()
      useGameWorldStore().$reset()
      useCombatStore().$reset() // Reset combat store too

      this.$router.push({ name: 'home' }) // Go back to main menu to start fresh
    },
    goHome() {
      this.$router.push({ name: 'home' }) // Go back to main menu
    },
  },
})
</script>

<style scoped>
.game-over-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--spacing-lg) * 2);
  text-align: center;
  padding: var(--spacing-lg);
}

.game-title-banner {
  /* Re-use banner styles */
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  color: #ff6347; /* Red color for game over */
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid #ff6347;
  border-radius: var(--border-radius-md);
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: var(--box-shadow-dark);
}

.game-over-screen h1 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  color: var(--color-accent-gold);
  margin-bottom: var(--spacing-lg);
}

.game-over-screen p {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  line-height: 1.8;
}

.game-over-animation-gif {
  width: 64px;
  height: auto;
  image-rendering: crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  margin-top: var(--spacing-xl);
}

.restart-button,
.home-button {
  /* Re-use button styles */
  background-color: var(--color-accent-bronze);
  color: var(--color-text-primary);
  border: 2px solid var(--color-accent-gold);
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

.restart-button:hover,
.home-button:hover {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary);
  border-color: var(--color-accent-bronze);
  transform: translateY(-2px);
}

.restart-button:active,
.home-button:active {
  transform: translateY(0);
  background-color: var(--color-accent-bronze);
}
</style>
