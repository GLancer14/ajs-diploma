import Bowman from '../Bowman.js';
import Swordsman from '../Swordsman.js';
import Magician from '../Magician.js';
import Daemon from '../Daemon.js';
import Vampire from '../Vampire.js';
import Undead from '../Undead.js';

const bowmanLevel1 = {
  level: 1,
  attack: 25,
  defence: 25,
  health: 50,
  type: 'bowman',
};
const swordsmanLevel1 = {
  level: 1,
  attack: 40,
  defence: 10,
  health: 50,
  type: 'swordsman',
};
const magicianLevel1 = {
  level: 1,
  attack: 10,
  defence: 40,
  health: 50,
  type: 'magician',
};
const daemonLevel1 = {
  level: 1,
  attack: 10,
  defence: 10,
  health: 50,
  type: 'daemon',
};
const vampireLevel1 = {
  level: 1,
  attack: 25,
  defence: 25,
  health: 50,
  type: 'vampire',
};
const undeadLevel1 = {
  level: 1,
  attack: 40,
  defence: 10,
  health: 50,
  type: 'undead',
};

test.each([
  [ 'bowman level 1', new Bowman(1), bowmanLevel1 ],
  [ 'swordsman level 1', new Swordsman(1), swordsmanLevel1 ],
  [ 'magician level 1', new Magician(1), magicianLevel1 ],
  [ 'daemon level 1', new Daemon(1), daemonLevel1 ],
  [ 'vampire level 1', new Vampire(1), vampireLevel1 ],
  [ 'undead level 1', new Undead(1), undeadLevel1 ],
])('check "%s" stats', (_, inputValue, expectedValue) => {
  expect(inputValue).toEqual(expectedValue);
});