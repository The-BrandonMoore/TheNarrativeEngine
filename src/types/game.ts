export interface PlayerState {
  name: string
  characterClass: 'Warrior' | 'Rogue' | 'Mage' | 'Archer'
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

// --- New Interfaces for Game Data ---

export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'WIN'
export type GamePhase = 'story' | 'combat' | 'puzzle' | 'dialogue' | 'event' // Different interaction types

// Represents a choice the player can make
export interface Choice {
  id: string // Unique ID for the choice
  text: string // Text displayed to the player for this choice
  targetId: string // What happens next (e.g., location ID, encounter ID, 'END_GAME')
  targetType: 'location' | 'encounter' | 'event' | 'game_over' | 'win' // What kind of target it is
  condition?: string // Optional: a string that refers to a game flag or player stat to check
  consequence?: string[] // Optional: actions that happen when this choice is made (e.g., 'gain_gold:10', 'lose_health:5')
}

// Represents a single game location or scene
export interface GameLocation {
  id: string // Unique ID for the location (e.g., "start_village", "gloomy_forest")
  name: string // Display name of the location
  description: string // The main narrative text for this location
  image?: string // Optional: path to a background image for visual flair later
  choices: Choice[] // Array of choices available in this location
  onEnterActions?: string[] // Optional: actions to trigger when entering (e.g., ["trigger_encounter:goblin_ambush"])
}

// Represents a combat, puzzle, or special event encounter
export interface GameEncounter {
  id: string // Unique ID (e.g., "goblin_ambush", "riddle_door")
  type: 'combat' | 'puzzle' | 'dialogue' | 'event' // Type of encounter
  title: string // Title for the encounter
  description: string // Narrative text for the encounter
  choices: Choice[] // Choices specific to this encounter
  enemyIds?: string[] // For combat: IDs of enemies involved
  solution?: string // For puzzle: expected solution
  onEndActions?: string[] // Actions when encounter concludes
  onFailActions?: string[] // Actions if encounter is failed
}

// Represents an item in the game world
export interface GameItem {
  id: string
  name: string
  description: string
  type: 'consumable' | 'weapon' | 'armor' | 'key_item' | 'junk'
  value?: number // Gold value
  effects?: string[] // Actions/effects when used (e.g., "heal:20")
  image?: string
}

// Represents a single enemy for combat
export interface GameEnemy {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  abilities?: string[]
  drops?: { itemId: string; chance: number }[] // What enemy might drop
  image?: string
}

// Represents global game flags or variables
export interface GameFlags {
  [key: string]: boolean | number | string // e.g., 'goblin_defeated': true, 'current_quest_stage': 2
}
