import PositionedCharacter from './PositionedCharacter.js';

/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  let tileType = '';
  const boardCellsCount = boardSize ** 2;
  if (index === 0) {
    tileType = 'top-left';
  } else if (index === boardSize - 1) {
    tileType = 'top-right';
  } else if (index === (boardCellsCount - boardSize)) {
    tileType = 'bottom-left';
  } else if (index === (boardCellsCount - 1)) {
    tileType = 'bottom-right';
  } else if (index < boardSize - 1) {
    tileType = 'top';
  } else if (index % boardSize === 0) {
    tileType = 'left';
  } else if ((index + 1) % boardSize === 0) {
    tileType = 'right';
  } else if (index < boardCellsCount && index > boardCellsCount - boardSize) {
    tileType = 'bottom';
  } else {
    tileType = 'center';
  }

  return tileType;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcPositionedCharacters(characterType, teamStorage, boardSize) {
  const boardCellsCount = boardSize ** 2;
  const possiblePositions = [];
  if (characterType === 'player') {
    for (let i = 0; i < boardCellsCount; i++) {
      if (i === 0 || i % boardSize === 0 || (i - 1) % boardSize === 0) {
        possiblePositions.push(i);
      }
    }
  } else {
    for (let i = 0; i < boardCellsCount; i++) {
      if ((i + 1) % boardSize === 0 || (i + 2) % boardSize === 0) {
        possiblePositions.push(i);
      }
    }
  }

  return teamStorage.map(item => {
    const randomPossiblePositionIndex = Math.floor(Math.random() * possiblePositions.length);
    const characterPosition = possiblePositions[randomPossiblePositionIndex];
    possiblePositions.splice(randomPossiblePositionIndex, 1);
    return new PositionedCharacter(item, characterPosition);
  });
}

export function calcDistanceBetweenTwoPoints(firstPoint, secondPoint) {
  const { row: x1, column: y1 } = firstPoint;
  const { row: x2, column: y2 } = secondPoint;
  return Number((Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)).toFixed(2));
}

export function blockBoard() {
  const board = document.querySelector('.board');
  const boardCloned = board.cloneNode(true);
  board.replaceWith(boardCloned);
}

export function blockWindow(existingTime) {
  const blockingWrapper = document.createElement('div');
  blockingWrapper.classList.add('blocking-wrapper');
  document.body.append(blockingWrapper);
  const clocks = document.createElement('span');
  clocks.classList.add('blocking-wrapper_clocks');
  clocks.textContent = '\u{1f551}';
  blockingWrapper.append(clocks);

  setTimeout(() => blockingWrapper.remove(), existingTime);
}

export function getCellCoordinates(index, boardSize) {
  const cellRow = Math.ceil((index + 1) / ((boardSize ** 2) + 1) * boardSize) - 1;
  const cellColumn = index - ((cellRow) * boardSize);
  return { row: cellRow, column: cellColumn };
}

export function compileTooltip(positionedCharacter) {
  const levelContent = `\u{1F396} ${positionedCharacter.character.level} `;
  const attackContent = `\u2694 ${positionedCharacter.character.attack} `;
  const defenceContent = `\u{1F6E1} ${positionedCharacter.character.defence} `;
  const healthContent = `\u2764 ${positionedCharacter.character.health}`;
  return ''.concat(levelContent, attackContent, defenceContent, healthContent);
}