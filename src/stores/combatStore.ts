import { defineStore } from 'pinia'
import { GameEnemy } from '@/types/game'
import { getEnemyById } from '@/services/dataLoader'

export interface CombatState {
  isActive: boolean
  currentEnemyIds: string[] // ids of enemies currently in combat
  enemies: GameEnemy[] // full data for active enemies
  turnOrder: string[] // (player, enemies)
  currentTurnEntityId: string | null // who's turn is it?
  combatLog: string[]
}

export const useCombatStore = defineStore('combat', {
  state: (): CombatState => ({
    isActive: false,
    currentEnemyIds: [],
    enemies: [],
    turnOrder: [],
    currentTurnEntityId: null,
    combatLog: [],
  }),
  getters: {
    isCombatActive: (state) => state.isActive,
    activeEnemies: (state) => state.enemies,
    isPlayerTurn: (state) => state.isActive && state.currentTurnEntityId === 'player',
  },

  actions: {
    startCombat(enemyIds: string[]) {
      this.isActive = true
      this.currentEnemyIds = enemyIds
      this.combatLog = [] // Clear previous combat log.

      const loadedEnemies: GameEnemy[] = []
      enemyIds.forEach((id) => {
        const enemyData = getEnemyById(id)
        if (enemyData) {
          loadedEnemies.push({ ...enemyData }) // "..." pushes a copy of the enemy, so we don't modify the original.
        } else {
          console.warn(`Enemy with ID ${id} not found!`)
        }
      })
      this.enemies = loadedEnemies

      this.turnOrder = ['player', ...enemyIds]
      this.currentTurnEntityId = 'player' // player starts every combat to start.

      this.combatLog.push('Combat has begun!')
      console.log('Combat started with enemies: ', this.enemies)
    },
    endCombat() {
      this.isActive = false
      this.currentEnemyIds = []
      this.enemies = []
      this.turnOrder = []
      this.currentTurnEntityId = null
      this.combatLog.push('The battle is finished.')
      console.log('Combat Session Ended')
    },
    nextTurn() {
      if (!this.isActive || !this.currentTurnEntityId) {
        return
      }
      const currentIndex = this.turnOrder.indexOf(this.currentTurnEntityId)
      const nextIndex = (currentIndex + 1) % this.turnOrder.length
      this.currentTurnEntityId = this.turnOrder[nextIndex]

      this.combatLog.push(`It is now ${this.currentTurnEntityId}'s turn...`)

      if (this.currentTurnEntityId !== 'player') {
        console.log(`${this.currentTurnEntityId} is taking its turn...`)
        setTimeout(() => {
          this.nextTurn()
        }, 500)
      }
    },

    updateEnemyHealth(enemyId: string, amount: number) {
      const enemy = this.enemies.find((e) => e.id === enemyId)
      if (enemy) {
        enemy.health = Math.max(0, enemy.health + amount)
        this.combatLog.push(
          `${enemy.name} health: <span class="math-inline">{enemy.health}/</span>{enemy.maxHealth}`,
        )
        if (enemy.health <= 0) {
          this.combatLog.push(`${enemy.name} has been defeated!`)
        }
      }
    },
    addCombatLog(message: string) {
      this.combatLog.push(message)
    },
  },
})
