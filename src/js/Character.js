/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(characterObject) {
    if (new.target.name === "Character") {
      throw new Error("Персонаж должен создаваться из дочернего класса!");
    }

    this.level = characterObject.level;
    this.attack = characterObject.attack || 0;
    this.defence = characterObject.defence || 0;
    this.health = 50;
    this.type = 'generic';
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  upgradeCharacter(levelCount) {
    for (let i = 0; i < levelCount; i++) {
      this.level += 1;
      this.health =  this.health < 20 ? this.health + 80 : 100;
      this.attack =  Math.max(this.attack, Math.round(this.attack * (50 + this.health) / 100));
      this.defence =  Math.max(this.defence, Math.round(this.defence * (50 + this.health) / 100));
    }
  }
}
