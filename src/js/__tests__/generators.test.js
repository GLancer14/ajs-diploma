import { playerTeamTypes } from '../characters/allowedTypes';
import { characterGenerator, generateTeam } from '../generators';

test('check unending characters generation', () => {
  const charactersNumber = 50;
  const generator = characterGenerator(playerTeamTypes, 1);
  const generatedCharacters = [];
  for (let i = 0; i < charactersNumber; i++) {
    generatedCharacters.push(generator.next().value);
  }

  const isMatch = playerTeamTypes.some(expected => {
    return generatedCharacters[generatedCharacters.length - 1] instanceof expected;
  });
  expect(isMatch).toBe(true);
  expect(generatedCharacters).toHaveLength(charactersNumber);
  expect(generatedCharacters).toContainEqual(new (playerTeamTypes[0])({ level: 1 }));
  expect(generatedCharacters).toContainEqual(new (playerTeamTypes[1])({ level: 1 }));
  expect(generatedCharacters).toContainEqual(new (playerTeamTypes[2])({ level: 1 }));
});

test('check characters count after team creation', () => {
  const team = generateTeam(playerTeamTypes, 2, 6);
  expect(team.length).toBe(6);
});

test('check characters level range after team creation', () => {
  const team = generateTeam(playerTeamTypes, 4, 50);
  const membersLevels = Array.from(new Set(team.map(character => character.level))).sort((a, b) => a - b);
  expect([
    1,
    2,
    3,
    4,
  ]).toEqual(membersLevels);
});