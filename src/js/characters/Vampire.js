import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 22;
    this.defence = 12;
    this.moveRange = 2;
    this.attackRange = 2;
    this.type = 'vampire';
  }
}