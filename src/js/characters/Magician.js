import Character from '../Character.js';

export default class Magician extends Character {
  constructor(characterObject) {
    super(Character);
    this.level = characterObject.level;
    this.attack = characterObject.attack || 20;
    this.defence = characterObject.defence || 15;
    this.moveRange = 1;
    this.attackRange = 4;
    this.type = 'magician';
  }
}