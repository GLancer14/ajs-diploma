import themes from "./themes.js";
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from "./characters/allowedTypes.js";
import { calcDistanceBetweenTwoPoints, calcPositionedCharacters } from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";
import cursors from "./cursors.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCharaterMovePossibleCells = [];
    this.selectedCharaterAttackPossibleCells = [];
    this.gameState = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes[this.gameState.gameLevel - 1]);
    let playerTeam;
    let foeTeam;

    if (this.gameState.gameLevel === 1 && !this.gameState.gameLoaded) {
      playerTeam = generateTeam(playerTeamTypes, 3, 3);
      foeTeam = generateTeam(foeTeamTypes, 1, 3);
      this.gameState.playerTeamPositioned = calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize);
      this.gameState.foeTeamPositioned = calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize);
    } else if (this.gameState.gameLevel > 1 && !this.gameState.gameLoaded) {
      playerTeam = this.gameState.playerTeamPositioned.map(item => item.character);
      foeTeam = generateTeam(foeTeamTypes, this.gameState.gameLevel, 3);
      this.gameState.playerTeamPositioned = calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize);
      this.gameState.foeTeamPositioned = calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize);
    }

    this.gameState.allPositionedCharacters = [ ...this.gameState.playerTeamPositioned, ...this.gameState.foeTeamPositioned ];
    this.gamePlay.redrawPositions(this.gameState.allPositionedCharacters);
    this.addCellsEnterListeners();
    this.addCellsLeaveListeners();
    this.addCellsClickListeners();
    this.addNewGameListener();
    this.addSaveGameListener();
    this.addLoadGameListener();
  }

  addNewGameListener() {
    this.gamePlay.addNewGameListener(this.onNewGameButtonClick);
  }

  addSaveGameListener() {
    this.gamePlay.addSaveGameListener(this.onSaveGameButtonClick);
  }

  addLoadGameListener() {
    this.gamePlay.addLoadGameListener(this.onLoadGameButtonClick);
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

  onNewGameButtonClick = () => {
    this.gameState = {
      currentTurn: 'player',
      selectedCharacter: null,
      nextFoeIndex: 0,
      gameLevel: 1,
      playerTeamPositioned: [],
      foeTeamPositioned: [],
      allPositionedCharacters: [],
      currentPoints: 0,
    };

    this.init();
    GamePlay.showMessage("Начинается новая игра!");
  }

  onSaveGameButtonClick = () => {
    this.stateService.save(this.gameState);
    GamePlay.showMessage("Игра сохранена!");
  }

  onLoadGameButtonClick = () => {
    const savedGameState = this.stateService.load();
    console.log(GameState.from(savedGameState));
    this.gameState = GameState.from(savedGameState);
    this.gameState.gameLoaded = true;
    this.init();
    this.gameState.gameLoaded = false;
    GamePlay.showMessage("Игра загружена!");
  }

  onCellClick = (index) => {
    const positionedCharacter = this.gameState.allPositionedCharacters.find(item => index === item.position);
    if (
      positionedCharacter &&
      this.gameState.playerTeamPositioned.some(item => item.character === positionedCharacter.character)
    ) {
      this.selectCharacter(positionedCharacter);
    } else if (
      this.gameState.selectedCharacter !== null &&
      this.selectedCharaterMovePossibleCells.some(wantedCell => wantedCell === index)
    ) {
      this.moveCharacter(index);
    } else if (
      this.gameState.selectedCharacter !== null &&
      this.selectedCharaterAttackPossibleCells.some(cellIndex => cellIndex === index)
    ) {
      this.attackCharacter(index);
    } else {
      GamePlay.showError("Можно выбрать только собственных персонажей");
    }
  }

  onCellEnter = (index) => {
    const positionedCharacter = this.gameState.allPositionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      const tooltipContent = this.compileTooltip(positionedCharacter);
      this.gamePlay.showCellTooltip(tooltipContent, index);
    }

    this.gamePlay.setCursor(this.setCursorType(index));
  }

  onCellLeave = (index) => {
    const positionedCharacter = this.gameState.allPositionedCharacters.find(item => index === item.position);
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
        this.gamePlay.cells.forEach((_, index) => {
          if (this.selectedCharaterAttackPossibleCells.some(possibleCellIndex => possibleCellIndex === index)) {
            this.gamePlay.deselectCell(index);
          }
        });
        this.gamePlay.selectCell(index, "red");

        return cursors.crosshair;
      } else if (
        index !== this.gameState.selectedCharacter.position &&
        this.gameState.allPositionedCharacters.some(positionedCharacter => positionedCharacter.position === index)
      ) {
        return cursors.pointer;
      } else if (index === this.gameState.selectedCharacter.position) {
        return cursors.auto;
      } else {
        return cursors.notallowed;
      }
    } else {
      if (this.gameState.allPositionedCharacters.some(positionedCharacter => positionedCharacter.position === index)) {
        return cursors.pointer;
      }

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
    this.gamePlay.redrawPositions(this.gameState.allPositionedCharacters);
    this.nextTurn();
  }

  async attackCharacter(index) {
    const foeCharacter = this.gameState.allPositionedCharacters.find(character => character.position === index);
    const damage = Math.max(this.gameState.selectedCharacter.character.attack - foeCharacter.character.defence, this.gameState.selectedCharacter.character.attack * 0.1);
    foeCharacter.character.health -= damage;
    this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
    this.gameState.selectedCharacter = null;
    this.gamePlay.deselectCell(index);
    await this.gamePlay.showDamage(index, damage);
    this.handleCharacterDeath(foeCharacter);
    this.gamePlay.redrawPositions(this.gameState.allPositionedCharacters);
    this.nextTurn();
  }

  handleCharacterDeath(attackedCharacter) {
    if (attackedCharacter.character.health <= 0) {
      if (foeTeamTypes.some(type => attackedCharacter.character instanceof type)) {
        this.gameState.currentPoints += 50;
      }

      this.gameState.playerTeamPositioned = this.gameState.playerTeamPositioned.filter(character => {
        return character !== attackedCharacter;
      });
      this.gameState.foeTeamPositioned = this.gameState.foeTeamPositioned.filter(character => {
        return character !== attackedCharacter;
      });
      this.gameState.allPositionedCharacters = [...this.gameState.playerTeamPositioned, ...this.gameState.foeTeamPositioned];
    }
  }

  getCellCoordinates(index) {
    const cellRow = Math.ceil((index + 1) / ((this.gamePlay.boardSize ** 2) + 1) * this.gamePlay.boardSize) - 1;
    const cellColumn = index - ((cellRow) * this.gamePlay.boardSize);
    return { row: cellRow, column: cellColumn };
  }

  getCellIndexFromCoordinates(coordinates) {
    return this.gamePlay.boardSize * coordinates.row + coordinates.column;
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
        const opponentTeam = this.gameState.currentTurn === "player" ? this.gameState.foeTeamPositioned : this.gameState.playerTeamPositioned;
        const charactersAtAttackRange = opponentTeam.find(positionedCharacter => {
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
        const charactersAtMoveRange = this.gameState.allPositionedCharacters.find((positionedCharacter) => {
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

  blockBoard() {
    const board = document.querySelector(".board");
    const boardCloned = board.cloneNode(true);
    board.replaceWith(boardCloned);
  }

  blockWindow(existingTime) {
    const blockingWrapper = document.createElement("div");
    blockingWrapper.classList.add("blocking-wrapper");
    document.body.append(blockingWrapper);
    const hourglass = document.createElement("span");
    hourglass.classList.add("blocking-wrapper_hourglass");
    hourglass.textContent = '\u{1f551}';
    blockingWrapper.append(hourglass);

    setTimeout(() => blockingWrapper.remove(), existingTime);
  }

  calculateFoeTurn() {
    const turnTime = 1000;
    this.gameState.selectedCharacter = this.gameState.foeTeamPositioned[this.gameState.nextFoeIndex];
    this.selectCharacter(this.gameState.selectedCharacter);
    this.blockWindow(turnTime);
    setTimeout(() => {
      this.activateFoe();
    }, turnTime);
  }

  calculateLevelUpAfterVictory() {
    this.gameState.playerTeamPositioned.forEach(positionedCharacter => {
        positionedCharacter.character.upgradeCharacter(1);
    });
  }

  activateFoe() {
    const playerTeamCharactersCoordinates = this.gameState.playerTeamPositioned.map(positionedCharacter => {
      return {coordinates: this.getCellCoordinates(positionedCharacter.position), position: positionedCharacter.position};
    });
    const foeCharacterCoordinates = this.getCellCoordinates(this.gameState.selectedCharacter.position);
    if (this.selectedCharaterAttackPossibleCells.length > 0) {
      const playerCharctersAvailableForAttack = this.gameState.playerTeamPositioned.filter(positionedCharacter => {
        return this.selectedCharaterAttackPossibleCells.includes(positionedCharacter.position);
      });
      const playerCharacterWithMinHealth = playerCharctersAvailableForAttack.sort((a, b) => a.character.health - b.character.health)[0];
      this.attackCharacter(playerCharacterWithMinHealth.position);
    } else {
      const closestPlayerCharacter = playerTeamCharactersCoordinates.map(playerCharacterPosition => {
        const distanceToPlayerCharacter = calcDistanceBetweenTwoPoints(playerCharacterPosition.coordinates, foeCharacterCoordinates);
        return {distanceToPlayerCharacter, playerCharacterPosition};
      }).sort((a, b) => a.distanceToPlayerCharacter - b.distanceToPlayerCharacter)[0];
      const closestCellToCharacter = this.selectedCharaterMovePossibleCells.map(possibleMoveCell => {
        const possibleMoveCellCoordinates = this.getCellCoordinates(possibleMoveCell);
        const distanceToPlayerCharacter = calcDistanceBetweenTwoPoints(closestPlayerCharacter.playerCharacterPosition.coordinates, possibleMoveCellCoordinates);
        return {distanceToPlayerCharacter, possibleMoveCell};
      }).sort((a, b) => a.distanceToPlayerCharacter - b.distanceToPlayerCharacter)[0];
      this.moveCharacter(closestCellToCharacter.possibleMoveCell);
    }
  }

  startNewLevel() {
    this.calculateLevelUpAfterVictory();
    this.gameState.gameLevel += 1;
    this.init();
    this.nextTurn();
  }

  runEndGameActions(endGameType) {
    this.blockBoard();
    this.gameState.topPoints = Math.max(this.gameState.topPoints, this.gameState.currentPoints);
    this.gameState.currentPoints = 0;
    GamePlay.showMessage(endGameType === 'win' ? "Вы победили!" : "Вы проиграли!");
  }

  checkEndGameActions() {
    if (this.gameState.playerTeamPositioned.length === 0) {
      this.runEndGameActions('lose');
      return true;
    } else if (this.gameState.foeTeamPositioned.length === 0 && this.gameState.gameLevel === 4) {
      this.runEndGameActions('win');
      return true;
    }
  }

  nextTurn() {
    this.gameState.currentTurn = this.gameState.currentTurn === 'player' ? 'foe' : 'player';
    if (this.gameState.currentTurn === 'foe' && this.gameState.foeTeamPositioned.length > 0) {
      this.gameState.nextFoeIndex = (this.gameState.nextFoeIndex + 1) % this.gameState.foeTeamPositioned.length;
      this.calculateFoeTurn();
      this.checkEndGameActions();
    } else {
      if (this.gameState.foeTeamPositioned.length === 0) {
        this.checkEndGameActions() || this.startNewLevel();
      }
    }
  }
}
