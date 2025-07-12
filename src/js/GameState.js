export default class GameState {
  constructor() {
    this.currentStep = 'player';
    this.selectedCharacterIndex = null;
  }

  static from(object) {
    // TODO: create object
    return null;
  }

  nextStep() {
    this.currentStep = this.currentStep === 'player' ? 'foe' : 'player';
  }
}
