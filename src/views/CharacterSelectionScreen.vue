<template>
  <div class="character-selection-screen">
    <!-- <div class="game-title-banner">The Narrative Engine</div> -->
    <h1>Create Your Adventurer!</h1>
    <!-- <p>Forge your destiny and begin your journey.</p> -->

    <div class="character-creation-section">
      <h2>Character Details:</h2>

      <div class="form-group">
        <label for="playerNameInput">Character Name:</label>
        <input
          type="text"
          id="playerNameInput"
          v-model="playerName"
          placeholder="Enter your name"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label>Choose Your Class:</label>
        <div class="class-selection-buttons">
          <button
            :class="{ 'class-button': true, selected: selectedClass === 'Warrior' }"
            @click="selectClass('Warrior')"
          >
            Warrior
          </button>
          <button
            :class="{ 'class-button': true, selected: selectedClass === 'Rogue' }"
            @click="selectClass('Rogue')"
          >
            Rogue
          </button>
          <button
            :class="{ 'class-button': true, selected: selectedClass === 'Mage' }"
            @click="selectClass('Mage')"
          >
            Mage
          </button>
          <button
            :class="{ 'class-button': true, selected: selectedClass === 'Archer' }"
            @click="selectClass('Archer')"
          >
            Archer
          </button>
        </div>
      </div>

      <div v-if="errorMessages.length" class="error-messages">
        <p v-for="(error, index) in errorMessages" :key="index">{{ error }}</p>
      </div>
    </div>
    <div v-if="selectedClass" class="character-image-container">
      <p class="image-label">{{ selectedClass }}</p>
      <img :src="characterImageSrc" :alt="selectedClass + ' portrait'" class="character-image" />
    </div>

    <div class="action-buttons">
      <button class="start-game-button" @click="startNewGame">Begin Adventure!</button>
      <button class="back-button" @click="goBack">Back to Main Menu</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

export default defineComponent({
  name: 'CharacterSelectionScreen',
  data() {
    return {
      playerName: '',
      selectedClass: '' as 'Warrior' | 'Rogue' | 'Mage' | 'Archer' | '',
      errorMessages: [] as string[],
    }
  },
  computed: {
    characterImageSrc(): string {
      if (this.selectedClass) {
        console.log(`/assets/images/HR_${this.selectedClass}.png`)
        return `/assets/images/HR_${this.selectedClass}.png`
      }
      return ''
    },
  },
  methods: {
    selectClass(characterClass: 'Warrior' | 'Rogue' | 'Mage' | 'Archer') {
      this.selectedClass = characterClass
      this.errorMessages = []
    },

    startNewGame() {
      this.errorMessages = []
      if (!this.playerName.trim()) {
        this.errorMessages.push('Please enter a character name.')
      }
      if (!this.selectedClass) {
        this.errorMessages.push('Please select a character class.')
      }

      if (this.errorMessages.length > 0) {
        return
      }

      const playerStore = usePlayerStore()

      playerStore.resetPlayerState() // Reset for a new game
      playerStore.setPlayerName(this.playerName.trim())
      playerStore.setCharacterClass(this.selectedClass as 'Warrior' | 'Rogue' | 'Mage' | 'Archer')

      console.log('Player created:', playerStore.name, playerStore.characterClass)
      this.$router.push({ name: 'gameplay' }) // Route to gameplay screen
    },
    goBack() {
      this.$router.push({ name: 'home' }) // Route back to the home screen
    },
  },
  mounted() {
    console.log('CharacterSelectionScreen component mounted!')
    // Optional: Pre-fill if coming back from game with character already made
    const playerStore = usePlayerStore()
    if (playerStore.isCharacterCreated) {
      this.playerName = playerStore.name
      this.selectedClass = playerStore.characterClass
    }
  },
})
</script>

<style scoped>
.character-selection-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--spacing-lg) * 2); /* Adjust based on App.vue padding */
  text-align: center;
  padding: var(--spacing-lg);
}

.character-selection-screen h1 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  color: var(--color-accent-gold);
  /* margin-bottom: var(--spacing-lg); */
  margin-bottom: var(--spacing-xs);
}

.character-selection-screen p {
  font-size: var(--font-size-md);
  /* margin-bottom: var(--spacing-xl); */
  max-width: 600px;
  line-height: 1.8;
}

.character-creation-section {
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--box-shadow-light);
}

.character-creation-section h2 {
  color: var(--color-accent-gold);
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-family-heading);
}

.form-group {
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.text-input {
  width: 100%;
  padding: var(--spacing-sm);
  background-color: var(--color-border-dark);
  border: 1px solid var(--color-accent-bronze);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  border-radius: var(--border-radius-sm);
  outline: none;
}

.text-input:focus {
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 5px var(--color-accent-gold);
}

.class-selection-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-sm);
}

.class-button {
  background-color: var(--color-border-dark);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent-bronze);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-body);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  flex-grow: 1;
  max-width: calc(33.33% - var(--spacing-sm));
}

.class-button:hover {
  background-color: var(--color-accent-bronze);
}

.class-button.selected {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary);
  border-color: var(--color-text-primary);
  font-weight: bold;
}

.error-messages {
  color: #ff6347;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  text-align: center;
}

.error-messages p {
  margin-bottom: var(--spacing-xs);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-xl); /* Space below character creation section */
}

.start-game-button,
.back-button {
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
  margin: var(--spacing-sm); /* Keep consistent margin */
}

.start-game-button:hover,
.back-button:hover {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary);
  border-color: var(--color-accent-bronze);
  transform: translateY(-2px);
}

.start-game-button:active,
.back-button:active {
  transform: translateY(0);
  background-color: var(--color-accent-bronze);
}

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
.character-selection-animation-gif {
  /* Name for the GIF in this specific screen */
  width: 64px;
  height: auto;
  image-rendering: crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  margin-top: var(--spacing-xl);
}
.character-image {
  /*
  These are the MOST CRITICAL properties for displaying pixel art correctly.
  Assuming your original portrait images (e.g., warrior_portrait.png) are 32x32 pixels.
  We're scaling them up 3x for better visibility on screen.
  So, 32px * 3 = 96px.
  */
  width: 250px; /* Set the display width of the image */
  height: 250px; /* Set the display height of the image */

  /* Ensure it's treated as a block element so width/height are respected */
  display: block;

  /* This is vital for pixel art to prevent blurring when scaled */
  image-rendering: crisp-edges;
  image-rendering: -webkit-crisp-edges; /* For Safari/Chrome older versions */
  image-rendering: pixelated; /* Modern and preferred */

  /* Optional: Add a small border and radius for visual appeal */
  border: 1px solid var(--color-accent-gold); /* A small gold border */
  border-radius: var(--border-radius-sm); /* Slightly rounded corners */
  margin-top: none;
  /* Space below the image, separating it from the label */
  margin-bottom: var(--spacing-xs);
}

/* Styles for the text label below the portrait */
.image-label {
  font-family: var(--font-family-heading); /* Use a heading-style font */
  font-size: var(--font-size-lg) !important; /* Make it a bit larger than body text */
  color: var(--color-accent-gold); /* Gold color for emphasis */
  text-transform: uppercase; /* Make it uppercase for stylistic choice */
  margin-bottom: 0px;
}

/* ... (rest of your existing styles for .text-input, .class-button, etc.) ... */
</style>
