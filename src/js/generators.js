import Team from './Team.js';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  for (;;) {
    const randomTypeIndex = Math.floor(Math.random() * allowedTypes.length);
    const characterConstructor = allowedTypes[randomTypeIndex];
    const newCharacterLevel = Math.ceil(Math.random() * maxLevel);
    const newCharacter = new characterConstructor({ level: 1 });
    if (newCharacterLevel > 1) {
      newCharacter.upgradeCharacter(newCharacterLevel - 1);
    }

    yield newCharacter;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = new Team(new Array(characterCount).fill(null).map(_ => {
    const nextCharacter = generator.next().value;
    return nextCharacter;
  }));
  return team.characters;
}
