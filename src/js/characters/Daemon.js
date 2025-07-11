import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(Character);
    this.level = level;
    this.attack = 10;
    this.defence = 10;
    this.type = 'daemon';
  }
}