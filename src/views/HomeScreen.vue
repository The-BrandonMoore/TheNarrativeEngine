<template>
  <div class="start-screen">
    <div class="game-title-banner">The Narrative Engine</div>
    <h1>Welcome, Adventurer</h1>
    <p>
      Prepare yourself. For the world of Azerim finds iteslf in peril. Only you are equipped to
      defeat the coming darkness and evil. God be with you Adventurer!
    </p>
    <div class="button-group">
      <button class="start-button" @click="navigateToCharacterSelection">Start New Game</button>
      <!-- <button class="load-button" @click="loadSavedGame">Load Saved Game</button> -->
    </div>

    <img
      src="C:\repos\BrandonPersonal\TheNarrativeEngine\src\assets\images\claudius_battle_sprite_animated.gif"
      alt="fighting knight"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeScreen',
  data() {
    return {
      playerName: '',
      selectedClass: '' as 'Warrior' | 'Mage' | 'Rogue' | 'Archer' | '',
      errorMessages: [] as string[],
    }
  },
  methods: {
    navigateToCharacterSelection() {
      this.$router.push({ name: 'character-selection' }) // Navigate to character selection screen
    },
    loadSavedGame() {
      alert('Load game functionality is not implemented yet.')
    },
  },
  mounted() {
    console.log('HomeView component mounted')
    //consider if I want to clear the playerStore on mount of StartScreen
    // if user comes back from game. For now, resetPlayerState in startNewGame.
  },
})
</script>

<style scoped>
/* Scoped styles only apply to this component */

.game-title-banner {
  font-family: var(--font-family-heading); /* Use a fancy display font */
  font-size: var(--font-size-xxl); /* Make it large and prominent */
  color: var(--color-accent-gold); /* Gold color for the title */
  text-transform: uppercase; /* Optional: Make it all caps */
  letter-spacing: 2px; /* Optional: Space out letters for impact */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8); /* Optional: Adds depth */
  margin-bottom: var(--spacing-lg); /* Space below the banner */
  padding: var(--spacing-sm) var(--spacing-md); /* Some padding around the text */
  border: 3px ridge #cd7f32;
  border-radius: 10px 200px 0px 200px;
  background-color: rgba(0, 0, 0, 0.4); /* Slightly transparent background for the banner */
  text-shadow: 2px 4px 3px rgba(255, 215, 0, 0.65);
  box-shadow: 0px 3px 17px 1px rgba(205, 127, 50, 0.57);
  -webkit-box-shadow: 0px 3px 17px 1px rgba(205, 127, 50, 0.57);
  -moz-box-shadow: 0px 3px 17px 1px rgba(205, 127, 50, 0.57); /* Add some shadow for a raised effect */
  padding-left: 40px; /* Add some left padding for better alignment */
  padding-right: 40px; /* Add some right padding for better alignment */
}
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
  color: var(--color-accent-bronze);
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
.button-group {
  margin-bottom: var(--spacing-xl);
}
</style>
