import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(characterObject) {
    super(Character);
    this.level = characterObject.level;
    this.attack = characterObject.attack || 22;
    this.defence = characterObject.defence || 12;
    this.moveRange = 2;
    this.attackRange = 2;
    this.type = 'bowman';
  }
}