import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.type = 'swordsman';
  }
}