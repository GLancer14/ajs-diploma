import Bowman from '../characters/Bowman.js';
import PositionedCharacter from '../PositionedCharacter.js';
import GamePlay from '../GamePlay.js';
import GameStateService from '../GameStateService.js';
import GameController from '../GameController.js';

test('check title tooltip compiling method', () => {
  const gamePlay = new GamePlay();
  const stateService = new GameStateService(globalThis.localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);
  const positionedCharacter = new PositionedCharacter(new Bowman({ level: 2 }), 1);
  const expectedValue = '\u{1F396} 2 \u2694 22 \u{1F6E1} 12 \u2764 50';
  expect(gameCtrl.compileTooltip(positionedCharacter)).toBe(expectedValue);
});