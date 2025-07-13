import themes from "./themes.js";
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from "./characters/allowedTypes.js";
import { calcPositionedCharacters } from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";
import cursors from "./cursors.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeamPositioned = [];
    this.foeTeamPositioned = [];
    this.allPositionedCharacters = [];
    this.selectedCharaterMovePossibleCells = [];
    this.selectedCharaterAttackPossibleCells = [];
    this.gameState = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.desert);
    const playerTeam = generateTeam(playerTeamTypes, 2, 3);
    const foeTeam = generateTeam(foeTeamTypes, 2, 3);

    this.playerTeamPositioned = calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize);
    this.foeTeamPositioned = calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize);
    this.allPositionedCharacters = [ ...this.playerTeamPositioned, ...this.foeTeamPositioned ];
    this.gamePlay.redrawPositions(this.allPositionedCharacters);
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
    const positionedCharacter = this.allPositionedCharacters.find(item => index === item.position);
    if (
      positionedCharacter &&
      this.playerTeamPositioned.some(item => item.character === positionedCharacter.character)
    ) {
      this.selectCharacter(positionedCharacter);
    } else if (
      this.gameState.selectedCharacter !== null &&
      this.selectedCharaterMovePossibleCells.some(wantedCell => wantedCell === index)
    ) {
      this.moveCharacter(index);
    } else {
      GamePlay.showError("Можно выбрать только собственных персонажей");
    }
  }

  onCellEnter = (index) => {
    const positionedCharacter = this.allPositionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      const tooltipContent = this.compileTooltip(positionedCharacter);
      this.gamePlay.showCellTooltip(tooltipContent, index);
    }

    const setCursorType = this.setCursorType(index);

    this.gamePlay.setCursor(setCursorType);

  }

  onCellLeave = (index) => {
    const positionedCharacter = this.allPositionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      this.gamePlay.hideCellTooltip(index);
    }

    if (this.gameState.selectedCharacter !== null && index !== this.gameState.selectedCharacter.position) {
      this.gamePlay.deselectCell(index);
    }
  }

  compileTooltip(positionedCharacter) {
    const levelContent = `\u{1F396} ${positionedCharacter.character.level} `;
    const attackContent = `\u2694 ${positionedCharacter.character.attack} `;
    const defenceContent = `\u{1F6E1} ${positionedCharacter.character.defence} `;
    const healthContent = `\u2764 ${positionedCharacter.character.health}`;
    return "".concat(levelContent, attackContent, defenceContent, healthContent);
  }

  setCursorType(index) {
    // const selectedCharacterRowIndex = Math.ceil((index + 1) / ((this.gamePlay.boardSize ** 2) + 1) * this.gamePlay.boardSize) - 1;
    // const selectedCharacterColumnIndex = Math.ceil(index / this.gamePlay.boardSize);
    // console.log();
    // console.log("Row: ", selectedCharacterRowIndex, "column: ", );
    // console.log(this.getCellCoordinates(index));
    if (this.gameState.selectedCharacter !== null) {
      if (this.selectedCharaterMovePossibleCells.some(item => item === index)) {
        this.gamePlay.cells.forEach((_, index) => {
          if (this.selectedCharaterMovePossibleCells.some(possibleCellIndex => possibleCellIndex === index)) {
            this.gamePlay.deselectCell(index);
          }
        });
        this.gamePlay.selectCell(index, "green");

        return cursors.pointer;
      } else if (this.selectedCharaterAttackPossibleCells.some(item => item === index)) {
        console.log("crosshair")
        this.gamePlay.cells.forEach((_, index) => {
          if (this.selectedCharaterAttackPossibleCells.some(possibleCellIndex => possibleCellIndex === index)) {
            this.gamePlay.deselectCell(index);
          }
        });
        this.gamePlay.selectCell(index, "red");

        return cursors.crosshair;
      } else if (
        index !== this.gameState.selectedCharacter.position &&
        this.allPositionedCharacters.some(positionedCharacter => positionedCharacter.position === index)
      ) {
        return cursors.pointer;
      } else if (index === this.gameState.selectedCharacter.position) {
        return cursors.auto;
      
      } else {
        return cursors.notallowed;
      }
    } else {
      return cursors.auto;
    }
  }

  selectCharacter(positionedCharacter) {
    if (this.gameState.selectedCharacter !== null) {
      this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
    }

    this.gameState.selectedCharacter = positionedCharacter;
    this.selectedCharaterMovePossibleCells = this.calcMovePossibleCellsIndexes();
    this.selectedCharaterAttackPossibleCells = this.calcAttackPossibleCellsIndexes();
    this.gamePlay.selectCell(positionedCharacter.position);
  }

  moveCharacter(index) {
    this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
    this.gameState.selectedCharacter.position = index;
    this.gamePlay.deselectCell(index);
    this.gameState.selectedCharacter = null;
    this.gamePlay.redrawPositions(this.allPositionedCharacters);
    this.gameState.nextStep();
  }

  getCellCoordinates(index) {
    const cellRow = Math.ceil((index + 1) / ((this.gamePlay.boardSize ** 2) + 1) * this.gamePlay.boardSize) - 1;
    const cellColumn = index - ((cellRow) * this.gamePlay.boardSize);
    return { row: cellRow, column: cellColumn };
  }

  calcAttackPossibleCellsIndexes() {
    if (this.gameState.selectedCharacter !== null) {
      const selectedCharacterIndex = this.gameState.selectedCharacter.position;
      const selectedCharacterAttackRange = this.gameState.selectedCharacter.character.attackRange;
      const selectedCharacterCoords = this.getCellCoordinates(selectedCharacterIndex);
      const possibleAttackCellsIndexes = [];
      for (let i = 0; i < this.gamePlay.cells.length; i++) {
        const possibleCellCoords = this.getCellCoordinates(i);
        if (
          possibleCellCoords.row <= selectedCharacterCoords.row + selectedCharacterAttackRange &&
          possibleCellCoords.row >= selectedCharacterCoords.row - selectedCharacterAttackRange &&
          possibleCellCoords.column >= selectedCharacterCoords.column - selectedCharacterAttackRange &&
          possibleCellCoords.column <= selectedCharacterCoords.column + selectedCharacterAttackRange
        ) {
          possibleAttackCellsIndexes.push(i);
        }
      }

      const filteredCells = possibleAttackCellsIndexes.filter(possibleCellIndex => {
        const charactersAtAttackRange = this.foeTeamPositioned.find(positionedCharacter => {
          return positionedCharacter.position === possibleCellIndex && selectedCharacterIndex !== possibleCellIndex
        });
        if (charactersAtAttackRange) {
          return true;
        }
      });
      return filteredCells;
    }
  }

  calcMovePossibleCellsIndexes() {
    if (this.gameState.selectedCharacter !== null) {
      const selectedCharacterIndex = this.gameState.selectedCharacter.position;
      const selectedCharacterMoveRange = this.gameState.selectedCharacter.character.moveRange;
      const { row: selectedCharacterIndexCellRow } = this.getCellCoordinates(selectedCharacterIndex);
      const possibleCellsIndexes = [];
      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = selectedCharacterIndex + i * this.gamePlay.boardSize;
          possibleCellsIndexes.push(cellIndex);
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = selectedCharacterIndex + i;
          if (
            cellIndex >= selectedCharacterIndexCellRow * this.gamePlay.boardSize &&
            cellIndex < selectedCharacterIndexCellRow * this.gamePlay.boardSize + this.gamePlay.boardSize
          ) {
            possibleCellsIndexes.push(cellIndex);
          }
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = Math.sign(i) === -1 ?
            selectedCharacterIndex - this.gamePlay.boardSize * Math.abs(i) + i :
            selectedCharacterIndex + this.gamePlay.boardSize * Math.abs(i) + i;
          if (
            cellIndex >= (selectedCharacterIndexCellRow + i) * this.gamePlay.boardSize &&
            cellIndex < (selectedCharacterIndexCellRow + i) * this.gamePlay.boardSize + this.gamePlay.boardSize
          ) {
            possibleCellsIndexes.push(cellIndex);
          }
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = Math.sign(i) === -1 ?
            selectedCharacterIndex - this.gamePlay.boardSize * Math.abs(i) - i :
            selectedCharacterIndex + this.gamePlay.boardSize * Math.abs(i) - i;
          if (
            cellIndex >= (selectedCharacterIndexCellRow + i) * this.gamePlay.boardSize &&
            cellIndex < (selectedCharacterIndexCellRow + i) * this.gamePlay.boardSize + this.gamePlay.boardSize
          ) {
            possibleCellsIndexes.push(cellIndex);
          }
        }
      }

      const filteredCells = possibleCellsIndexes.filter(possibleCellIndex => {
        const charactersAtMoveRange = this.allPositionedCharacters.find((positionedCharacter) => {
          return possibleCellIndex === positionedCharacter.position;
        });
        
        if (
          possibleCellIndex >= 0 &&
          possibleCellIndex < this.gamePlay.boardSize ** 2 &&
          !charactersAtMoveRange
        ) {
          return true;
        }
      });

      return filteredCells;
    }
  }
}
