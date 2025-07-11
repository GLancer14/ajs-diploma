import { playerTeamTypes } from "../characters/allowedTypes";
import { characterGenerator, generateTeam } from "../generators";

test('check unending characters generation', () => {
  const generator = characterGenerator(playerTeamTypes, 2);
  let generatorReturnedValue;
  for (let i = 0; i < 100; i++) {
    generatorReturnedValue = generator.next().value;
  }

  const isMatch = playerTeamTypes.some(expected => generatorReturnedValue instanceof expected);
  expect(isMatch).toBe(true);
});

test('check characters count after team creation', () => {
  const team = generateTeam(playerTeamTypes, 2, 6);
  expect(team.length).toBe(6);
});

test('check characters level range after team creation', () => {
  const team = generateTeam(playerTeamTypes, 4, 50);
  const rangeCorrectness = team.every(character => character.level > 0 && character.level <= 4);
  expect(rangeCorrectness).toBe(true);
});