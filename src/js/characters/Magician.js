import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.moveRange = 1;
    this.attackRange = 4;
    this.type = 'magician';
  }
}