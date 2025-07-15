import GamePlay from "./GamePlay.js";

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      const gameState = this.storage.getItem('state');
      if (gameState === null) {
        throw new Error('Invalid state');
      }
      
      return JSON.parse(gameState);
    } catch (e) {
      GamePlay.showError(e.message);
    }
  }
}
