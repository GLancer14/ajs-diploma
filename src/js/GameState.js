import GameController from "./GameController.js";

export default class GameState {
  constructor() {
    this.currentStep = 'player';
    this.selectedCharacter = null;
    this.foeCharactersQueue = [];
    this.nextFoeIndex = 0;
  }

  static from(object) {
    // TODO: create object
    return null;
  }

  nextStep() {
    this.currentStep = this.currentStep === 'player' ? 'foe' : 'player';
    if (this.currentStep === 'foe') {
      this.nextFoeIndex++;
      GameController.calculateFoeTurn();
    }
  }
}
