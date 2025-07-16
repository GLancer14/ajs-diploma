"use strict";

var _GamePlay = _interopRequireDefault(require("./GamePlay"));
var _GameController = _interopRequireDefault(require("./GameController"));
var _GameStateService = _interopRequireDefault(require("./GameStateService"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Entry point of app: don't change this
 */

var gamePlay = new _GamePlay["default"]();
gamePlay.bindToDOM(document.querySelector('#game-container'));
var stateService = new _GameStateService["default"](localStorage);
var gameCtrl = new _GameController["default"](gamePlay, stateService);
gameCtrl.init();

// don't write your code here