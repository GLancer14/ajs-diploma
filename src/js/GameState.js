import GameController from "./GameController.js";

export default class GameState {
  constructor() {
    this.currentTurn = 'player';
    this.selectedCharacter = null;
    this.nextFoeIndex = 0;
    this.gameLevel = 1;
    this.playerTeamPositioned = [];
    this.foeTeamPositioned = [];
    this.allPositionedCharacters = [];
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
