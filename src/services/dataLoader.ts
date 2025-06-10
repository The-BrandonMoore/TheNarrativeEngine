import { type GameLocation, type GameEncounter, type GameItem, type GameEnemy } from '@/types/game'

interface GameData {
  locations: Map<string, GameLocation>
  encounters: Map<string, GameEncounter>
  items: Map<string, GameItem>
  enemies: Map<string, GameEnemy>
}

let loadedGameData: GameData | null = null

export async function loadGameData(): Promise<GameData> {
  if (loadedGameData) {
    return loadedGameData // Return cached data if already loaded
  }

  try {
    const [locationsArray, encountersArray, itemsArray, enemiesArray] = await Promise.all([
      fetch('/assets/data/locations.json').then((res) => res.json()),
      fetch('/assets/data/encounters.json').then((res) => res.json()),
      fetch('/assets/data/items.json').then((res) => res.json()),
      fetch('/assets/data/enemies.json').then((res) => res.json()),
    ])

    // Convert arrays to Maps for efficient lookup by ID
    loadedGameData = {
      locations: new Map(locationsArray.map((loc: GameLocation) => [loc.id, loc])),
      encounters: new Map(encountersArray.map((enc: GameEncounter) => [enc.id, enc])),
      items: new Map(itemsArray.map((item: GameItem) => [item.id, item])),
      enemies: new Map(enemiesArray.map((enemy: GameEnemy) => [enemy.id, enemy])),
    }

    console.log('Game data loaded successfully:', loadedGameData)
    return loadedGameData
  } catch (error) {
    console.error('Failed to load game data:', error)
    throw error // Propagate error
  }
}

// You can also add functions to get specific data without re-loading
export function getGameData(): GameData | null {
  return loadedGameData
}

export function getLocationById(id: string): GameLocation | undefined {
  return loadedGameData?.locations.get(id)
}

export function getEncounterById(id: string): GameEncounter | undefined {
  return loadedGameData?.encounters.get(id)
}

export function getEnemyById(id: string): GameEnemy | undefined {
  return loadedGameData?.enemies.get(id)
}

export function getItemById(id: string): GameItem | undefined {
  return loadedGameData?.items.get(id)
}
