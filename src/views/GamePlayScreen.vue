<template>
  <div class="gamplay-screen">
    <div class="game-top-bar">
      <h1>The Adventure Begins</h1>
      <button class="back-button" @click="goHome">Exit Game</button>
    </div>

    <div class="game-content-area">
      <div class="player-stats">
        <h2>{{ playerName }}'s Stats</h2>
        <p>Health: {{ playerHealth }} / {{ playerMaxHealth }}</p>
        <p>Attack: {{ playerAttack }}</p>
        <p>Defense: {{ playerDefense }}</p>
        <p>Gold: {{ playerGold }}</p>
        <p>
          Inventory:
          {{ playerInventory.length > 0 ? playerInventory.join(', ') : 'Inventory Empty' }}
        </p>
      </div>

      <div class="main-story-area">
        <div class="story-text-box">
          <p class="current-description">{{ currentDescription }}</p>
          <p v-if="lastActionMessage" class="last-action-message">{{ lastActionMessage }}</p>
        </div>

        <div class="choices-area">
          <button
            v-for="choice in currentChoices"
            :key="choice.id"
            class="choice-button"
            @click="processChoice(choice)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>

      <div class="game-log-panel">
        <h2>Game Log</h2>
        <div class="log-entries">
          <p v-for="(entry, index) in gameWorldStore.storyLog" :key="index" class="log-entry">
            {{ entry }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useGameWorldStore } from '../stores/gameWorldStore'
import { getGameData } from '../services/dataLoader'
import { type GameLocation, type GameEncounter, type Choice } from '../types/game'

export default defineComponent({
  name: 'GamePlayScreen',
  data() {
    return {
      currentDescription: '', // Choices for the current location/encounter
      currentChoices: [] as Choice[], // Choices for the current location/encounter
      lastActionMessage: '', // A message from the last action (e.g., "You gained 10 gold!")
    }
  },
  computed: {
    playerStore() {
      return usePlayerStore()
    },
    gameWorldStore() {
      return useGameWorldStore()
    },
    playerName(): string {
      return this.playerStore.name
    },
    characterClass(): string {
      return this.playerStore.characterClass
    },
    playerHealth(): number {
      return this.playerStore.health
    },
    playerMaxHealth(): number {
      return this.playerStore.maxHealth
    },
    playerAttack(): number {
      return this.playerStore.attack
    },
    playerDefense(): number {
      return this.playerStore.defense
    },
    playerInventory(): string[] {
      return this.playerStore.inventory
    },
    playerGold(): number {
      return this.playerStore.gold
    },
    playerAbilities(): string[] {
      return this.playerStore.abilities
    },
    playerExperience(): number {
      return this.playerStore.experience
    },
    playerLevel(): number {
      return this.playerStore.level
    },
  },
  methods: {
    initializeGame() {
      this.gameWorldStore.resetGameWorldState() // Choices for the current location/encounter
      this.updateCurrentScene()
      // Add initial story log entry
      this.gameWorldStore.addStoryLog(
        'The adventure begins! You awaken on the outskirts of Steamhaven.',
      )
    },
    updateCurrentScene() {
      const gameData = getGameData()
      if (!gameData) {
        console.error('Game Data not loaded yet!')
        return
      }

      let scene: GameLocation | GameEncounter | undefined
      if (this.gameWorldStore.currentEncounterId) {
        scene = gameData.encounters.get(this.gameWorldStore.currentEncounterId)
      } else if (this.gameWorldStore.currentLocationId) {
        scene = gameData.locations.get(this.gameWorldStore.currentLocationId)
      }

      if (scene) {
        this.currentDescription = scene.description
        this.currentChoices = scene.choices
        this.gameWorldStore.addStoryLog(scene.description)
        // handle onEnterActions if present
        if ('onEnterActions' in scene && scene.onEnterActions) {
          this.processActions(scene.onEnterActions)
        }
      } else {
        this.currentDescription = 'Error: Invalid game state or location/encounter ID!'
        this.currentChoices = []
        console.error(
          'Could not find scene for ID:',
          this.gameWorldStore.currentLocationId || this.gameWorldStore.currentEncounterId,
        )
      }
    },
    processChoice(choice: Choice) {
      this.lastActionMessage = '' //Clears the message from the previous choice.
      this.gameWorldStore.addStoryLog(`> ${choice.text}`)

      //TODO Placeholder: Process consequences of choice.
      if (choice.consequence && choice.consequence.length > 0) {
        this.processActions(choice.consequence)
      }
      // Navigate based on targetType
      switch (choice.targetType) {
        case 'location':
          this.gameWorldStore.setCurrentLocation(choice.targetId)
          break
        case 'encounter':
          this.gameWorldStore.setCurrentEncounter(choice.targetId)
          break
        case 'game_over':
          this.gameWorldStore.setGameStatus('GAME_OVER')
          // Navigate to game over screen (future)
          const router = useRouter()
          router.push({ name: 'gameover' }) // Assuming you'll create this route
          break
        case 'win':
          this.gameWorldStore.setGameStatus('WIN')
          // Navigate to win screen (future)
          const winRouter = useRouter()
          winRouter.push({ name: 'win' }) // Assuming you'll create this route
          break
        case 'event': // Special events that don't change location/encounter directly (e.g., dialogue progression)
          // For 'event' type, we'd need more complex logic. For now, assume it's handled by consequences.
          // Or if it leads to a new "text chunk" (event_id: "guard_dialogue_peril")
          // this.gameWorldStore.setCurrentEncounter(choice.targetId); // if event is actually a sub-encounter
          this.lastActionMessage = `Event triggered: ${choice.targetId}` // Placeholder message
          // For now, if 'event' type, we just refresh the current scene description
          // or handle it in `processActions` for simple narrative progression.
          this.updateCurrentScene() // Re-display current scene or check flags
          break
        default:
          console.warn('Unknown targetType:', choice.targetType)
          this.lastActionMessage = 'Nothing happened.'
      }
    },
    // Placeholder for processing actions (e.g., gain_gold:10, lose_health:5, set_flag:quest1_started:true)
    processActions(actions: string[]) {
      actions.forEach((action) => {
        const [type, value] = action.split(':')
        switch (type) {
          case 'gain_gold':
            this.playerStore.addGold(parseInt(value))
            this.lastActionMessage += `You gained ${value} gold! `
            break
          case 'lose_health':
            this.playerStore.takeDamage(parseInt(value))
            this.lastActionMessage += `You lost ${value} health! `
            break
          case 'set_flag':
            const [flagName, flagValue] = value.split(',')
            this.gameWorldStore.setGameFlag(flagName, flagValue === 'true' ? true : flagValue)
            this.lastActionMessage += `Game flag '<span class="math-inline">{flagName}' set to '</span>{flagValue}'. `
            break
          case 'start_combat': // Placeholder for combat initiation
            this.gameWorldStore.setGameStatus('PLAYING')
            this.lastActionMessage += `Combat initiated! Enemies: ${value}. `
            break
          // ... add more action types as game grows
          default:
            console.warn('Unknown action type:', action)
        }
      })
    },
    goHome() {
      this.$router.push({ name: 'home' }) // Navigate to the start screen
    },
  },
  watch: {
    'gameWorldStore.currentLocationId': {
      handler() {
        this.updateCurrentScene()
      },
      immediate: false,
    },
    'gameWorldStore.currentEncounterId': {
      handler() {
        this.updateCurrentScene()
      },
      immediate: false,
    },
  },
  created() {
    // If coming from CharacterSelectionScreen, current status should be PLAYING
    // Initialize game world if it's not already playing or coming from a load
    if (this.gameWorldStore.gameStatus !== 'PLAYING' || !this.gameWorldStore.currentLocationId) {
      this.initializeGame()
    } else {
      // If already playing (e.g., browser refresh during development), just update scene
      this.updateCurrentScene()
    }
  },
  mounted() {
    console.log('GamePlayScreen component mounted.')
    console.log(
      'Player data on Gameplay Screen:',
      this.playerName,
      this.characterClass,
      this.playerHealth,
    )
  },
})
</script>

<style scoped>
.gameplay-screen {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--spacing-lg) * 2);
  text-align: center;
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 1200px; /* Constrain max width for better readability */
  margin: 0 auto; /* Center the main game screen content */
}

.game-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-lg);
}

.game-top-bar h1 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  color: var(--color-accent-gold);
  margin: 0; /* Remove default h1 margin */
}

.game-content-area {
  display: flex;
  flex-grow: 1; /* Allow content area to take available space */
  gap: var(--spacing-lg); /* Space between panels */
  width: 100%;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  justify-content: center; /* Center panels if they wrap */
  align-items: flex-start; /* Align panels to the top */
}

.player-stats-panel,
.game-log-panel {
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--color-accent-bronze);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--box-shadow-light);
  flex-shrink: 0; /* Don't shrink these panels */
  flex-basis: 250px; /* Base width for side panels */
  max-height: 70vh; /* Max height for scrollable panels */
  overflow-y: auto; /* Enable scrolling for log */
  text-align: left; /* Align text within panels */
}

.player-stats-panel h2,
.game-log-panel h2 {
  color: var(--color-accent-gold);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  text-align: center; /* Center headings within panels */
}

.player-stats-panel p,
.game-log-panel p {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}

.main-story-area {
  flex-grow: 1; /* Allows this area to take remaining space */
  min-width: 400px; /* Minimum width before wrapping */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push story text and choices apart */
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--color-accent-gold); /* Main story border */
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-dark);
}

.story-text-box {
  margin-bottom: var(--spacing-lg);
  text-align: left;
  flex-grow: 1; /* Allow text box to take space */
  overflow-y: auto; /* If text gets very long */
  max-height: 50vh; /* Limit height if needed */
}

.current-description {
  font-size: var(--font-size-base);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.last-action-message {
  font-size: var(--font-size-sm);
  color: var(--color-accent-gold); /* Highlight last action */
  font-style: italic;
  margin-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border-dark);
  padding-top: var(--spacing-sm);
}

.choices-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm); /* Space between choice buttons */
  width: 100%;
  margin-top: var(--spacing-lg); /* Space above choices */
}

.choice-button {
  background-color: var(--color-accent-bronze);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent-gold);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-body);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  text-align: left; /* Align choice text to the left */
  flex-grow: 1;
}

.choice-button:hover {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary);
  transform: translateY(-1px);
}

.choice-button:active {
  transform: translateY(0);
  background-color: var(--color-accent-bronze);
}

.game-log-panel .log-entries {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  overflow-y: auto; /* Ensure log itself is scrollable */
  max-height: 85%; /* Adjust as needed */
  padding-right: var(--spacing-xs); /* For scrollbar */
}

.game-log-panel .log-entry {
  margin-bottom: var(--spacing-xs);
  border-bottom: 1px dotted var(--color-border-dark);
  padding-bottom: var(--spacing-xs);
}

.game-log-panel .log-entry:last-child {
  border-bottom: none;
}

.back-button {
  /* Re-use existing button styles from HomeView/CharacterSelectionScreen */
  background-color: var(--color-accent-bronze);
  color: var(--color-text-primary);
  border: 2px solid var(--color-accent-gold);
  padding: var(--spacing-sm) var(--spacing-md); /* Slightly smaller for top bar */
  font-size: var(--font-size-sm);
  font-family: var(--font-family-heading);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.1s ease;
}
.back-button:hover {
  background-color: var(--color-accent-gold);
  color: var(--color-background-primary);
  border-color: var(--color-accent-bronze);
  transform: translateY(-2px);
}
.back-button:active {
  transform: translateY(0);
  background-color: var(--color-accent-bronze);
}
</style>
