import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.moveRange = 2;
    this.attackRange = 2;
    this.type = 'bowman';
  }
}