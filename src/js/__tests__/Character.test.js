import Character from '../Character.js';
import Bowman from '../characters/Bowman.js';

test('creating character by Character constructor', () => {
  expect(() => new Character(2)).toThrow('Персонаж должен создаваться из дочернего класса!');
});

test('creating character by exact character type constructor', () => {
  const newCharacter = new Bowman(2);
  expect(newCharacter).toBeInstanceOf(Bowman);
});