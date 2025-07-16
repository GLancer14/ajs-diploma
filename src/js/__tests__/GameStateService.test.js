/**
 * @jest-environment jsdom
 */

import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

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

test('succesful state extraction', () => {
  const stateService = new GameStateService(window.localStorage);
  stateService.storage.setItem('state', '{}');

  expect(stateService.load()).toEqual({});
});