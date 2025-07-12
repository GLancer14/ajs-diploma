import themes from "./themes.js";
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from "./characters/allowedTypes.js";
import { calcPositionedCharacters } from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = [];
    this.foeTeam = [];
    this.allPostionedCharacters = [];
    this.gameState = new GameState();
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
    this.addCellsClickListeners();
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

  addCellsClickListeners() {
    this.gamePlay.cells.forEach(() => {
      this.gamePlay.addCellClickListener(this.onCellClick);
    });
  }

  onCellClick = (index) => {
    const positionedCharacter = this.allPostionedCharacters.find(item => index === item.position);
    if (positionedCharacter && this.playerTeam.some(item => item === positionedCharacter.character)) {
      if (this.gameState.selectedCharacterIndex !== null) {
        this.gamePlay.deselectCell(this.gameState.selectedCharacterIndex);
      }

      this.gameState.selectedCharacterIndex = index;
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError("Можно выбрать только собственных персонажей");
    }
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
