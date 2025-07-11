import themes from "./themes.js";
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from "./characters/allowedTypes.js";
import { calcPositionedCharacters } from "./utils.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.desert);
    const playerTeam = generateTeam(playerTeamTypes, 2, 3);
    const foeTeam = generateTeam(foeTeamTypes, 2, 3);
    const allPostionedCharacters = [
      ...calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize),
      ...calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize),
    ];
    this.gamePlay.redrawPositions(allPostionedCharacters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
