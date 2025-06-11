/**
 * Rolls a single die of a specified number of sides.
 * @param sides The number of sides on the die (e.g., 6 for d6, 20 for d20).
 * @returns A random integer between 1 and `sides` (inclusive).
 */
export function rollDie(sides: number): number {
  if (sides <= 0) {
    console.warn('Dice sides must be a positive whole number.')
    return 0
  }
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Rolls multiple dice and sums their results.
 * @param1 numDice The number of dice to roll.
 * @param2 sides The number of sides on each die.
 * @returns The sum of the dice rolls.
 */
export function rollDice(numDice: number, sides: number): number {
  let total = 0
  for (let i = 0; i < numDice; i++) {
    total += rollDie(sides)
  }
  return total
}

/**
 * Simulates a skill check with a target difficulty class (DC).
 * @param1 skillValue The player's relevant skill value (e.g., player's agility, perception).
 * @param2 dc The difficulty class (target number to beat).
 * @returns True if the check succeeds (roll + skill >= DC), false otherwise.
 */
export function skillCheck(skillValue: number, dc: number): boolean {
  const roll = rollDie(20) // Standard D&D d20 roll
  const result = roll + skillValue
  console.log(`Skill Check (d20 + ${skillValue}): Rolled ${roll}, Result: ${result} (DC: ${dc})`)
  return result >= dc
}
