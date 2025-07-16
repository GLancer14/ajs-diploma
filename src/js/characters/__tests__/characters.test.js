import Bowman from '../Bowman.js';
import Swordsman from '../Swordsman.js';
import Magician from '../Magician.js';
import Daemon from '../Daemon.js';
import Vampire from '../Vampire.js';
import Undead from '../Undead.js';

const bowmanLevel1 = {
  level: 1,
  attack: 22,
  defence: 12,
  health: 50,
  moveRange: 2,
  attackRange: 2,
  type: 'bowman',
};
const swordsmanLevel1 = {
  level: 1,
  attack: 25,
  defence: 10,
  health: 50,
  moveRange: 4,
  attackRange: 1,
  type: 'swordsman',
};
const magicianLevel1 = {
  level: 1,
  attack: 20,
  defence: 15,
  health: 50,
  moveRange: 1,
  attackRange: 4,
  type: 'magician',
};
const daemonLevel1 = {
  level: 1,
  attack: 20,
  defence: 10,
  health: 50,
  moveRange: 1,
  attackRange: 4,
  type: 'daemon',
};
const vampireLevel1 = {
  level: 1,
  attack: 22,
  defence: 12,
  health: 50,
  moveRange: 2,
  attackRange: 2,
  type: 'vampire',
};
const undeadLevel1 = {
  level: 1,
  attack: 25,
  defence: 10,
  health: 50,
  moveRange: 4,
  attackRange: 1,
  type: 'undead',
};

test.each([
  [
    'bowman level 1',
    new Bowman({ level: 1 }),
    bowmanLevel1
  ],
  [
    'swordsman level 1',
    new Swordsman({ level: 1 }),
    swordsmanLevel1
  ],
  [
    'magician level 1',
    new Magician({ level: 1 }),
    magicianLevel1
  ],
  [
    'daemon level 1',
    new Daemon({ level: 1 }),
    daemonLevel1
  ],
  [
    'vampire level 1',
    new Vampire({ level: 1 }),
    vampireLevel1
  ],
  [
    'undead level 1',
    new Undead({ level: 1 }),
    undeadLevel1
  ],
])('check "%s" stats', (_, inputValue, expectedValue) => {
  expect(inputValue).toEqual(expectedValue);
});