/**
 * @jest-environment jsdom
 */

import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
});

test('failed stage extraction', () => {
  const stateService = new GameStateService(window.localStorage);
  const spyMessage = jest.spyOn(GamePlay, 'showError');
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  stateService.storage.clear();
  stateService.load();
  expect(spyMessage).toHaveBeenCalled();
});

test('succesful stage extraction', () => {
  const stateService = new GameStateService(window.localStorage);
  const spy = jest.spyOn(stateService, 'load').mockReturnValue({"currentTurn":"player","selectedCharacter":null,"nextFoeIndex":0,"gameLevel":2,"playerTeamPositioned":[{"character":{"level":2,"attack":30,"defence":23,"health":100,"type":"magician","moveRange":1,"attackRange":4},"position":1},{"character":{"level":2,"attack":34,"defence":14,"health":85,"type":"swordsman","moveRange":4,"attackRange":1},"position":33}],"foeTeamPositioned":[{"character":{"level":2,"attack":38,"defence":15,"health":100,"type":"undead","moveRange":4,"attackRange":1},"position":39},{"character":{"level":2,"attack":30,"defence":15,"health":100,"type":"daemon","moveRange":1,"attackRange":4},"position":23},{"character":{"level":1,"attack":20,"defence":10,"health":50,"type":"daemon","moveRange":1,"attackRange":4},"position":31}],"allPositionedCharacters":[{"character":{"level":2,"attack":30,"defence":23,"health":100,"type":"magician","moveRange":1,"attackRange":4},"position":1},{"character":{"level":2,"attack":34,"defence":14,"health":85,"type":"swordsman","moveRange":4,"attackRange":1},"position":33},{"character":{"level":2,"attack":38,"defence":15,"health":100,"type":"undead","moveRange":4,"attackRange":1},"position":39},{"character":{"level":2,"attack":30,"defence":15,"health":100,"type":"daemon","moveRange":1,"attackRange":4},"position":23},{"character":{"level":1,"attack":20,"defence":10,"health":50,"type":"daemon","moveRange":1,"attackRange":4},"position":31}],"highScores":0,"currentScores":150,"gameLoaded":false});
  
  expect(stateService.load()).toEqual({"currentTurn":"player","selectedCharacter":null,"nextFoeIndex":0,"gameLevel":2,"playerTeamPositioned":[{"character":{"level":2,"attack":30,"defence":23,"health":100,"type":"magician","moveRange":1,"attackRange":4},"position":1},{"character":{"level":2,"attack":34,"defence":14,"health":85,"type":"swordsman","moveRange":4,"attackRange":1},"position":33}],"foeTeamPositioned":[{"character":{"level":2,"attack":38,"defence":15,"health":100,"type":"undead","moveRange":4,"attackRange":1},"position":39},{"character":{"level":2,"attack":30,"defence":15,"health":100,"type":"daemon","moveRange":1,"attackRange":4},"position":23},{"character":{"level":1,"attack":20,"defence":10,"health":50,"type":"daemon","moveRange":1,"attackRange":4},"position":31}],"allPositionedCharacters":[{"character":{"level":2,"attack":30,"defence":23,"health":100,"type":"magician","moveRange":1,"attackRange":4},"position":1},{"character":{"level":2,"attack":34,"defence":14,"health":85,"type":"swordsman","moveRange":4,"attackRange":1},"position":33},{"character":{"level":2,"attack":38,"defence":15,"health":100,"type":"undead","moveRange":4,"attackRange":1},"position":39},{"character":{"level":2,"attack":30,"defence":15,"health":100,"type":"daemon","moveRange":1,"attackRange":4},"position":23},{"character":{"level":1,"attack":20,"defence":10,"health":50,"type":"daemon","moveRange":1,"attackRange":4},"position":31}],"highScores":0,"currentScores":150,"gameLoaded":false});
})