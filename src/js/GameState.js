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
    this.topPoints = 0;
    this.currentPoints = 0;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
