import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 20;
    this.defence = 15;
    this.moveRange = 1;
    this.attackRange = 4;
    this.type = 'magician';
  }
}