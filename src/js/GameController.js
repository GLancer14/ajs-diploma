import themes from "./themes.js";
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from "./characters/allowedTypes.js";
import { calcPositionedCharacters } from "./utils.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = [];
    this.foeTeam = [];
    this.allPostionedCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.desert);
    this.playerTeam = generateTeam(playerTeamTypes, 2, 3);
    this.foeTeam = generateTeam(foeTeamTypes, 2, 3);
    this.allPostionedCharacters = [
      ...calcPositionedCharacters('player', this.playerTeam, this.gamePlay.boardSize),
      ...calcPositionedCharacters('foe', this.foeTeam, this.gamePlay.boardSize),
    ];
    this.gamePlay.redrawPositions(this.allPostionedCharacters);
    this.addCellsEnterListeners();
    this.addCellsLeaveListeners();
  }

  addCellsEnterListeners() {
    this.gamePlay.cells.forEach(() => {
      this.gamePlay.addCellEnterListener(this.onCellEnter);
    });
  }

  addCellsLeaveListeners() {
    this.gamePlay.cells.forEach(() => {
      this.gamePlay.addCellLeaveListener(this.onCellLeave);
    });
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter = (index) => {
    const positionedCharacter = this.allPostionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      const tooltipContent = this.compileTooltip(positionedCharacter);
      this.gamePlay.showCellTooltip(tooltipContent, index);
    }
  }

  onCellLeave = (index) => {
    const positionedCharacter = this.allPostionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  compileTooltip(positionedCharacter) {
    const levelContent = `\u{1F396} ${positionedCharacter.character.level} `;
    const attackContent = `\u2694 ${positionedCharacter.character.attack} `;
    const defenceContent = `\u{1F6E1} ${positionedCharacter.character.defence} `;
    const healthContent = `\u2764 ${positionedCharacter.character.health}`;
    return "".concat(levelContent, attackContent, defenceContent, healthContent);
  }
}
