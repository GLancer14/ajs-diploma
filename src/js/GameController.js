import themes from './themes.js';
import { generateTeam } from './generators.js';
import { playerTeamTypes, foeTeamTypes } from './characters/allowedTypes.js';
import {
  blockWindow,
  calcDistanceBetweenTwoPoints,
  calcPositionedCharacters,
  compileTooltip,
  getCellCoordinates
} from './utils.js';
import GameState from './GameState.js';
import GamePlay from './GamePlay.js';
import cursors from './cursors.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCharaterMovePossibleCells = [];
    this.selectedCharaterAttackPossibleCells = [];
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes[this.gameState.gameLevel - 1]);
    this.gameState.setHighScores();
    this.gameState.setCurrentScores();
    let playerTeam;
    let foeTeam;

    if (this.gameState.gameLevel === 1 && !this.gameState.gameLoaded) {
      playerTeam = generateTeam(playerTeamTypes, 2, 4);
      foeTeam = generateTeam(foeTeamTypes, 1, 3);
      this.gameState.playerTeamPositioned = calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize);
      this.gameState.foeTeamPositioned = calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize);
    } else if (this.gameState.gameLevel > 1 && !this.gameState.gameLoaded) {
      playerTeam = this.gameState.playerTeamPositioned.map(item => item.character);
      foeTeam = generateTeam(foeTeamTypes, this.gameState.gameLevel, 3 + this.gameState.gameLevel);
      this.gameState.playerTeamPositioned = calcPositionedCharacters('player', playerTeam, this.gamePlay.boardSize);
      this.gameState.foeTeamPositioned = calcPositionedCharacters('foe', foeTeam, this.gamePlay.boardSize);
    }

    this.gameState.allPositionedCharacters = [
      ...this.gameState.playerTeamPositioned,
      ...this.gameState.foeTeamPositioned,
    ];
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
    const resetGameStateObject = { highScores: this.gameState.highScores };
    this.gameState = new GameState(resetGameStateObject);
    this.init();
    this.gameState.setHighScores(this.gameState.highScores);
    GamePlay.showMessage('Начинается новая игра!');
  };

  onSaveGameButtonClick = () => {
    this.stateService.save(this.gameState);
    GamePlay.showMessage('Игра сохранена!');
  };

  onLoadGameButtonClick = () => {
    try {
      const savedGameState = this.stateService.load();
      this.gameState = new GameState(GameState.from(savedGameState));
      this.gameState.gameLoaded = true;
      this.init();
      this.gameState.gameLoaded = false;
      this.gameState.setHighScores(this.gameState.highScores);
      GamePlay.showMessage('Игра загружена!');
    } catch(e) {
      GamePlay.showError('Invalid state');
    }
  };

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
    } else if (this.gameState.selectedCharacter !== null) {
      GamePlay.showError('Вы не можете сделать такой ход');
    } else {
      GamePlay.showError('Можно выбрать только собственных персонажей');
    }
  };

  onCellEnter = (index) => {
    const positionedCharacter = this.gameState.allPositionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      const tooltipContent = compileTooltip(positionedCharacter);
      this.gamePlay.showCellTooltip(tooltipContent, index);
    }

    this.gamePlay.setCursor(this.setCursorType(index));
  };

  onCellLeave = (index) => {
    const positionedCharacter = this.gameState.allPositionedCharacters.find(item => index === item.position);
    if (positionedCharacter) {
      this.gamePlay.hideCellTooltip(index);
    }

    if (this.gameState.selectedCharacter !== null && index !== this.gameState.selectedCharacter.position) {
      this.gamePlay.deselectCell(index);
    }
  };

  setCursorType(index) {
    const selectedCharacter = this.gameState.selectedCharacter;
    if (selectedCharacter !== null && this.gameState.playerTeamPositioned.includes(selectedCharacter)) {
      if (this.selectedCharaterMovePossibleCells.some(item => item === index)) {
        this.gamePlay.cells.forEach((_, cellBeingTested) => {
          if (this.selectedCharaterMovePossibleCells.some(cellIndex => cellIndex === cellBeingTested)) {
            this.gamePlay.deselectCell(cellBeingTested);
          }
        });
        this.gamePlay.selectCell(index, 'green');

        return cursors.pointer;
      } else if (this.selectedCharaterAttackPossibleCells.some(item => item === index)) {
        this.gamePlay.cells.forEach((_, cellBeingTested) => {
          if (this.selectedCharaterAttackPossibleCells.some(cellIndex => cellIndex === cellBeingTested)) {
            this.gamePlay.deselectCell(cellBeingTested);
          }
        });
        this.gamePlay.selectCell(index, 'red');

        return cursors.crosshair;
      } else if (
        index !== selectedCharacter.position &&
        this.gameState.playerTeamPositioned.some(positionedCharacter => positionedCharacter.position === index)
      ) {
        return cursors.pointer;
      } else if (index === selectedCharacter.position) {
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
    const selectedCharacterAttack = this.gameState.selectedCharacter.character.attack;
    const damage = Math.max(
      selectedCharacterAttack - foeCharacter.character.defence,
      Math.round(selectedCharacterAttack * 0.1)
    );
    foeCharacter.character.health -= damage;
    this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
    this.gameState.selectedCharacter = null;
    this.gamePlay.deselectCell(index);
    await this.gamePlay.showDamage(index, damage);
    this.handleCharacterDeath(foeCharacter);
    this.gamePlay.redrawPositions(this.gameState.allPositionedCharacters);
    if (this.gameState.checkEndGameActions()) {
      return;
    }

    this.nextTurn();
  }

  handleCharacterDeath(attackedCharacter) {
    if (attackedCharacter.character.health <= 0) {
      if (foeTeamTypes.some(type => attackedCharacter.character instanceof type)) {
        this.gameState.currentScores += 50;
        this.gameState.setCurrentScores();
      }

      this.gameState.playerTeamPositioned = this.gameState.playerTeamPositioned.filter(character => {
        return character !== attackedCharacter;
      });
      this.gameState.foeTeamPositioned = this.gameState.foeTeamPositioned.filter(character => {
        return character !== attackedCharacter;
      });
      this.gameState.allPositionedCharacters = [
        ...this.gameState.playerTeamPositioned,
        ...this.gameState.foeTeamPositioned
      ];
    }
  }

  calcAttackPossibleCellsIndexes() {
    if (this.gameState.selectedCharacter !== null) {
      const selectedCharacterIndex = this.gameState.selectedCharacter.position;
      const selectedCharacterAttackRange = this.gameState.selectedCharacter.character.attackRange;
      const selectedCharacterCoords = getCellCoordinates(selectedCharacterIndex, this.gamePlay.boardSize);
      const possibleAttackCellsIndexes = [];
      for (let i = 0; i < this.gamePlay.cells.length; i++) {
        const possibleCellCoords = getCellCoordinates(i, this.gamePlay.boardSize);
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
        const opponentTeam = this.gameState.currentTurn === 'player' ?
          this.gameState.foeTeamPositioned :
          this.gameState.playerTeamPositioned;
        const charactersAtAttackRange = opponentTeam.find(positionedCharacter => {
          return positionedCharacter.position === possibleCellIndex && selectedCharacterIndex !== possibleCellIndex;
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
      const boardSize = this.gamePlay.boardSize;
      const selectedCharacterIndex = this.gameState.selectedCharacter.position;
      const selectedCharacterMoveRange = this.gameState.selectedCharacter.character.moveRange;
      const { row: selectedCharacterIndexCellRow } = getCellCoordinates(
        selectedCharacterIndex,
        this.gamePlay.boardSize
      );
      const possibleCellsIndexes = [];
      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = selectedCharacterIndex + i * boardSize;
          possibleCellsIndexes.push(cellIndex);
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = selectedCharacterIndex + i;
          if (
            cellIndex >= selectedCharacterIndexCellRow * boardSize &&
            cellIndex < selectedCharacterIndexCellRow * boardSize + boardSize
          ) {
            possibleCellsIndexes.push(cellIndex);
          }
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = Math.sign(i) === -1 ?
            selectedCharacterIndex - boardSize * Math.abs(i) + i :
            selectedCharacterIndex + boardSize * Math.abs(i) + i;
          if (
            cellIndex >= (selectedCharacterIndexCellRow + i) * boardSize &&
            cellIndex < (selectedCharacterIndexCellRow + i) * boardSize + boardSize
          ) {
            possibleCellsIndexes.push(cellIndex);
          }
        }
      }

      for (let i = -selectedCharacterMoveRange; i <= selectedCharacterMoveRange; i++) {
        if (i !== 0) {
          const cellIndex = Math.sign(i) === -1 ?
            selectedCharacterIndex - boardSize * Math.abs(i) - i :
            selectedCharacterIndex + boardSize * Math.abs(i) - i;
          if (
            cellIndex >= (selectedCharacterIndexCellRow + i) * boardSize &&
            cellIndex < (selectedCharacterIndexCellRow + i) * boardSize + boardSize
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
          possibleCellIndex < boardSize ** 2 &&
          !charactersAtMoveRange
        ) {
          return true;
        }
      });

      return filteredCells;
    }
  }

  calculateFoeTurn() {
    const turnTime = 1000;
    this.gameState.selectedCharacter = this.gameState.foeTeamPositioned[this.gameState.nextFoeIndex];
    this.selectCharacter(this.gameState.selectedCharacter);
    blockWindow(turnTime + 500);
    setTimeout(() => {
      this.activateFoe();
    }, turnTime);
  }

  calculateLevelUpAfterVictory() {
    this.gameState.playerTeamPositioned.forEach(positionedCharacter => {
      if (positionedCharacter.character.level < 4) {
        positionedCharacter.character.upgradeCharacter(1);
      }
    });
  }

  activateFoe() {
    const playerTeamCharactersCoordinates = this.gameState.playerTeamPositioned.map(positionedCharacter => {
      return {
        coordinates: getCellCoordinates(positionedCharacter.position, this.gamePlay.boardSize),
        position: positionedCharacter.position,
      };
    });
    const foeCharacterCoordinates = getCellCoordinates(
      this.gameState.selectedCharacter.position,
      this.gamePlay.boardSize
    );
    if (this.selectedCharaterAttackPossibleCells.length > 0) {
      const playerCharctersAvailableForAttack = this.gameState.playerTeamPositioned.filter(positionedCharacter => {
        return this.selectedCharaterAttackPossibleCells.includes(positionedCharacter.position);
      });
      const playerCharacterWithMinHealth = playerCharctersAvailableForAttack.sort((a, b) => {
        return a.character.health - b.character.health;
      })[0];
      this.attackCharacter(playerCharacterWithMinHealth.position);
    } else {
      const closestPlayerCharacter = playerTeamCharactersCoordinates.map(playerCharacterPosition => {
        const distanceToPlayerCharacter = calcDistanceBetweenTwoPoints(
          playerCharacterPosition.coordinates,
          foeCharacterCoordinates
        );
        return { distanceToPlayerCharacter, playerCharacterPosition };
      }).sort((a, b) => a.distanceToPlayerCharacter - b.distanceToPlayerCharacter)[0];
      const closestCellToCharacter = this.selectedCharaterMovePossibleCells.map(possibleMoveCell => {
        const possibleMoveCellCoordinates = getCellCoordinates(possibleMoveCell, this.gamePlay.boardSize);
        const distanceToPlayerCharacter = calcDistanceBetweenTwoPoints(
          closestPlayerCharacter.playerCharacterPosition.coordinates,
          possibleMoveCellCoordinates
        );
        return { distanceToPlayerCharacter, possibleMoveCell };
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

  nextTurn() {
    this.gameState.currentTurn = this.gameState.currentTurn === 'player' ? 'foe' : 'player';
    if (this.gameState.currentTurn === 'foe' && this.gameState.foeTeamPositioned.length > 0) {
      this.gameState.nextFoeIndex = (this.gameState.nextFoeIndex + 1) % this.gameState.foeTeamPositioned.length;
      this.calculateFoeTurn();
    } else {
      if (this.gameState.foeTeamPositioned.length === 0) {
        this.startNewLevel();
      }
    }
  }
}
