import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 25;
    this.defence = 10;
    this.moveRange = 4;
    this.attackRange = 1;
    this.type = 'swordsman';
  }
}