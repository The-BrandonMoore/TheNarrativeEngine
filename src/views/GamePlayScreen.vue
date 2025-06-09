<template>
  <div class="gamplay-screen">
    <h1>The Adventure Begins</h1>
    <p>
      Welcome, <span class="player-name">{{ playerName }}</span> the
      <span class="player-class">{{ characterClass }}</span
      >!
    </p>
    <div class="player-stats">
      <h2>{{ playerName }}'s Stats</h2>
      <p>Health: {{ playerHealth }} / {{ playerMaxHealth }}</p>
      <p>Attack: {{ playerAttack }}</p>
      <p>Defense: {{ playerDefense }}</p>
      <p>Gold: {{ playerGold }}</p>
      <p>
        Inventory: {{ playerInventory.length > 0 ? playerInventory.join(', ') : 'Inventory Empty' }}
      </p>
    </div>

    <p>This is where your story will unfold . . .</p>

    <button class="back-button" @click="goHome">Back To Start</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'

export default defineComponent({
  name: 'GamePlayScreen',
  data() {
    return {}
  },
  computed: {
    playerStore() {
      return usePlayerStore()
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
    goHome() {
      const router = useRouter()
      router.push({ name: 'start' }) // Navigate to the start screen
    },
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
