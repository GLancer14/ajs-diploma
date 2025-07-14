import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 20;
    this.defence = 10;
    this.moveRange = 1;
    this.attackRange = 4;
    this.type = 'daemon';
  }
}