import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(characterObject) {
    super(Character);
    this.level = characterObject.level;
    this.attack = characterObject.attack || 25;
    this.defence = characterObject.defence || 10;
    this.moveRange = 4;
    this.attackRange = 1;
    this.type = 'swordsman';
  }
}