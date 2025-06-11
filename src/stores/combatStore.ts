import { defineStore } from 'pinia'
import { type GameEnemy } from '@/types/game'
import { getEnemyById } from '@/services/dataLoader'
import { usePlayerStore } from './playerStore'

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
    isPlayersTurn: (state) => state.isActive && state.currentTurnEntityId === 'player',
    allEnemiesDefeated: (state) => state.enemies.every((enemy) => enemy.health <= 0),
    isPlayerDefeated: () => {
      const playerStore = usePlayerStore()
      return playerStore.health <= 0
    },
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
      //check for combat end conditions *before* advancing turn if needed
      if (this.allEnemiesDefeated) {
        this.addCombatLog('Combat is over, all enemies have been defeated!')
        this.endCombat()
        return
      }
      if (this.isPlayerDefeated) {
        this.addCombatLog('Combat is over, you have been defeated.')
        this.endCombat()
        return
      }

      const currentIndex = this.turnOrder.indexOf(this.currentTurnEntityId)
      let nextIndex = (currentIndex + 1) % this.turnOrder.length
      const nextEntityId = this.turnOrder[nextIndex]

      while (nextEntityId !== 'player' && this.enemies.some((e) => e.id === nextEntityId)) {
        console.log(`Skipping defeated enemy: ${nextEntityId}`)
        nextIndex = (nextIndex + 1) % this.turnOrder.length
        if (nextEntityId === 'player' && this.allEnemiesDefeated) {
          break
        }
      }
      this.currentTurnEntityId = nextEntityId
      this.combatLog.push(`It is now ${this.currentTurnEntityId}'s turn...`)

      if (this.currentTurnEntityId !== 'player') {
        //Find the actual enemy object
        const activeEnemy = this.enemies.find((e) => e.id === this.currentTurnEntityId)
        if (activeEnemy && activeEnemy.health > 0) {
          this.addCombatLog(`${activeEnemy.name} prepares to attack!`)
          setTimeout(() => {
            const playerStore = usePlayerStore()
            const damageDealt = Math.max(1, activeEnemy.attack - playerStore.defense)
            this.dealDamageToPlayer(damageDealt)

            //After enemy action check for player defeat
            if (this.isPlayerDefeated) {
              this.addCombatLog(
                `You have been defeated. All hope is now lost. The world has fallen into darkness. Thanks for nothing ${playerStore.name}! Game Over`,
              )
              this.endCombat()
            } else if (!this.allEnemiesDefeated) {
              this.nextTurn()
            }
          }, 1000)
        } else {
          this.nextTurn()
        }
      }
    },

    dealDamageToEnemy(enemyId: string, damage: number) {
      const enemy = this.enemies.find((e) => e.id === enemyId)
      if (enemy) {
        enemy.health = Math.max(0, enemy?.health - damage)
        this.addCombatLog(`${enemy.name} takes ${damage}.  (${enemy.health} / ${enemy.maxHealth})`)
        if (enemy.health <= 0) {
          this.addCombatLog(`${enemy.name} has been defeated!`)
          if (this.allEnemiesDefeated) {
            this.addCombatLog('You have defeated all enemies! The battle has been won!')
            this.endCombat()
            // TODO: handle rewards, EXP, return to location, etc.
          }
        }
      }
    },

    dealDamageToPlayer(damage: number) {
      const playerStore = usePlayerStore()
      playerStore.takeDamage(damage)
      this.addCombatLog(
        `You take ${damage} damage! Remaining Health (${playerStore.health} / ${playerStore.maxHealth})`,
      )

      if (playerStore.health <= 0) {
        this.addCombatLog(
          `You have been defeated. All hope is now lost. The world has fallen into darkness. Thanks for nothing ${playerStore.name}!`,
        )
        this.endCombat()
        // TODO: trigger game over screen
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
