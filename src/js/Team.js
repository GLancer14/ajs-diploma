import PositionedCharacter from './PositionedCharacter.js';

/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(characters) {
    this.characters = characters;
  }

  calcPositionedCharacters(characterType, boardSize) {
    const boardCellsCount = boardSize ** 2;
    const possiblePositions = [];
    if (characterType === 'player') {
      for (let i = 0; i < boardCellsCount; i++) {
        if (i === 0 || i % boardSize === 0 || (i - 1) % boardSize === 0) {
          possiblePositions.push(i);
        }
      }
    } else {
      for (let i = 0; i < boardCellsCount; i++) {
        if ((i + 1) % boardSize === 0 || (i + 2) % boardSize === 0) {
          possiblePositions.push(i);
        }
      }
    }

    return this.characters.map(item => {
      const randomPossiblePositionIndex = Math.floor(Math.random() * possiblePositions.length);
      const characterPosition = possiblePositions[randomPossiblePositionIndex];
      possiblePositions.splice(randomPossiblePositionIndex, 1);
      return new PositionedCharacter(item, characterPosition);
    });
  }
}
