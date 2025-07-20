import Bowman from '../characters/Bowman.js';
import PositionedCharacter from '../PositionedCharacter.js';
import { compileTooltip } from '../utils.js';

test('check title tooltip compiling method', () => {
  const positionedCharacter = new PositionedCharacter(new Bowman({ level: 2 }), 1);
  const expectedValue = '\u{1F396} 2 \u2694 22 \u{1F6E1} 12 \u2764 50';
  expect(compileTooltip(positionedCharacter)).toBe(expectedValue);
});