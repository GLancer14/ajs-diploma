import { calcTileType } from '../utils';

test.each([
  [
    'top-left',
    [ 0, 7 ],
    'top-left'
  ],
  [ 'top-right',
    [ 6, 7 ],
    'top-right'
  ],
  [
    'bottom-left',
    [ 42, 7 ],
    'bottom-left'
  ],
  [
    'bottom-right',
    [ 48, 7 ],
    'bottom-right'
  ],
  [
    'top',
    [ 3, 7 ],
    'top'
  ],
  [
    'left',
    [ 14, 7 ],
    'left'
  ],
  [
    'right',
    [ 13, 7 ],
    'right'
  ],
  [
    'bottom',
    [ 44, 7 ],
    'bottom'
  ],
  [
    'center',
    [ 23, 7 ],
    'center'
  ],
])('check "%s" position of board cell', (_, inputValue, expectedValue) => {
  const outputValue = calcTileType(...inputValue);
  expect(outputValue).toBe(expectedValue);
});