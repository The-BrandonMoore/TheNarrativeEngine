// src/stores/gameWorldStore.ts
import { defineStore } from 'pinia'
import {
  type GameStatus,
  type GameFlags,
  type GameLocation,
  type GameEncounter,
} from '@/types/game' // Import types

export interface GameWorldState {
  gameStatus: GameStatus
  currentLocationId: string | null
  currentEncounterId: string | null
  storyLog: string[] // Array of past narrative messages / actions
  gameFlags: GameFlags // Global flags for story progression
  // Potentially store loaded game data here, or load it via a service
  // We'll keep loaded data in a service for now, but sometimes it's in store.
}

export const useGameWorldStore = defineStore('gameWorld', {
  state: (): GameWorldState => ({
    gameStatus: 'MENU', // Initial status
    currentLocationId: null, // No location selected initially
    currentEncounterId: null, // No active encounter
    storyLog: [], // Empty log
    gameFlags: {}, // Empty flags
  }),

  getters: {
    // Example getter: get current location object (needs access to loaded data)
    // We'll implement this more fully when we integrate dataLoader
    // It's more complex as a direct getter because it needs the loaded data map.
  },

  actions: {
    setGameStatus(status: GameStatus) {
      this.gameStatus = status
    },
    setCurrentLocation(locationId: string) {
      this.currentLocationId = locationId
      this.currentEncounterId = null // Clear active encounter when changing location
    },
    setCurrentEncounter(encounterId: string) {
      this.currentEncounterId = encounterId
    },
    addStoryLog(message: string) {
      this.storyLog.push(message)
      // Optional: limit log size
      if (this.storyLog.length > 100) {
        // Keep last 100 entries
        this.storyLog.shift()
      }
    },
    setGameFlag(flagName: string, value: boolean | number | string) {
      this.gameFlags[flagName] = value
    },
    resetGameWorldState() {
      this.$reset()
      // Important: also set initial state for new game
      this.gameStatus = 'PLAYING' // Assume we start playing after reset
      this.currentLocationId = 'start_village' // Your starting location ID
      this.storyLog = []
      this.gameFlags = {}
    },
  },
})
