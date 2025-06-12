import { defineStore } from 'pinia'

export interface PlayerState {
  name: string
  characterClass: 'Warrior' | 'Mage' | 'Rogue' | 'Archer' | ''
  health: number
  maxHealth: number
  attack: number
  defense: number
  inventory: string[]
  gold: number
  abilities: string[]
  experience: number
  level: number
  image?: string
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    name: '',
    characterClass: '',
    health: 0,
    maxHealth: 0,
    attack: 0,
    defense: 0,
    inventory: [],
    gold: 0,
    abilities: [],
    experience: 0,
    level: 1,
    image: undefined,
  }),
  getters: {
    isCharacterCreated: (state) => state.name !== '' && state.characterClass !== '',
    healthPercentage: (state) => (state.maxHealth > 0 ? (state.health / state.maxHealth) * 100 : 0),
    isAlive: (state) => state.health > 0,
    xpToNextLevel: (state) => state.level * 100,
    xpPercentage: (state) => (state.level > 0 ? (state.experience / (state.level * 100)) * 100 : 0),
  },
  actions: {
    setPlayerName(name: string) {
      this.name = name
    },
    setCharacterClass(charachterClass: 'Warrior' | 'Mage' | 'Rogue' | 'Archer') {
      this.characterClass = charachterClass
      switch (charachterClass) {
        case 'Warrior':
          this.health = 120
          this.maxHealth = 120
          this.attack = 15
          this.defense = 10
          this.abilities = ['Slash']
          break
        case 'Rogue':
          this.health = 80
          this.maxHealth = 80
          this.attack = 25
          this.defense = 5
          this.abilities = ['Sneak Attack']
          break
        case 'Mage':
          this.health = 70
          this.maxHealth = 70
          this.attack = 30
          this.defense = 3
          this.abilities = ['Fireball', 'Ice Spike']
          break
        case 'Archer':
          this.health = 80
          this.maxHealth = 80
          this.attack = 25
          this.defense = 7
          this.abilities = ['Shoot Arrow']
          break
        default:
          throw new Error('Please choose a character class')
      }
    },
    resetPlayerState() {
      this.$reset()
      this.characterClass = ''
      this.experience = 0
      this.level = 1
      this.image = undefined
    },
    takeDamage(amount: number) {
      this.health = Math.max(0, this.health - amount)
    },
    heal(amount: number) {
      this.health = Math.min(this.maxHealth, this.health + amount)
    },
    addGold(amount: number) {
      this.gold += amount
    },
    removeGold(amount: number) {
      this.gold = Math.max(0, this.gold - amount)
    },
    addItemToInventory(itemId: string) {
      if (!this.inventory.includes(itemId)) {
        this.inventory.push(itemId)
      }
    },
    removeItemFromInventory(itemId: string) {
      const index = this.inventory.indexOf(itemId)
      if (index !== -1) {
        this.inventory.splice(index, 1)
      }
    },
    // Gain Experience
    gainExperience(amount: number) {
      this.experience += amount
      if (this.experience > this.xpToNextLevel) {
        this.levelUp()
      }
    },
    levelUp() {
      this.level++
      this.experience = this.experience - (this.level - 1) * 100
      this.health = this.maxHealth
      this.attack += 2
      this.defense += 1
      this.addGold(50)
      console.log(`Player Store: ${this.name} leveled up to Level ${this.level!}`)
    },
  },
})
