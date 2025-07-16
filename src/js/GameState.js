import { foeTeamTypes, playerTeamTypes } from './characters/allowedTypes.js';
import PositionedCharacter from './PositionedCharacter.js';

export default class GameState {
  constructor(gameState) {
    this.currentTurn = gameState?.currentTurn || 'player';
    this.selectedCharacter = gameState?.selectedCharacter || null;
    this.nextFoeIndex = gameState?.nextFoeIndex || 0;
    this.gameLevel = gameState?.gameLevel || 1;
    this.playerTeamPositioned = gameState?.playerTeamPositioned || [];
    this.foeTeamPositioned = gameState?.foeTeamPositioned || [];
    this.allPositionedCharacters = gameState?.allPositionedCharacters || [];
    this.highScores = gameState?.highScores || 0;
    this.currentScores = gameState?.currentScores || 0;
    this.gameLoaded = false;
  }

  static from(object) {
    const playerTeamPositioned = object.playerTeamPositioned.map(positionedCharacter => {
      const CharacterConstructor = playerTeamTypes.find(CharacterClass => {
        const exampleCharacterClassInstance = new CharacterClass({ level: 1 });
        return exampleCharacterClassInstance.type === positionedCharacter.character.type;
      });
      const newCharacter = new CharacterConstructor(positionedCharacter.character);

      return new PositionedCharacter(newCharacter, positionedCharacter.position);
    });

    const foeTeamPositioned = object.foeTeamPositioned.map(positionedCharacter => {
      const CharacterConstructor = foeTeamTypes.find(CharacterClass => {
        const exampleCharacterClassInstance = new CharacterClass({ level: 1 });
        return exampleCharacterClassInstance.type === positionedCharacter.character.type;
      });
      const newCharacter = new CharacterConstructor(positionedCharacter.character);

      return new PositionedCharacter(newCharacter, positionedCharacter.position);
    });

    const allPositionedCharacters = [ ...playerTeamPositioned, ...foeTeamPositioned ];

    return {
      ...object,
      playerTeamPositioned,
      foeTeamPositioned,
      allPositionedCharacters,
    };
  }
}
