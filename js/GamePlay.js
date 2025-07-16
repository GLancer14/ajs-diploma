"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _utils = require("./utils");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var GamePlay = exports["default"] = /*#__PURE__*/function () {
  function GamePlay() {
    _classCallCheck(this, GamePlay);
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }
  return _createClass(GamePlay, [{
    key: "bindToDOM",
    value: function bindToDOM(container) {
      if (!(container instanceof HTMLElement)) {
        throw new Error('container is not HTMLElement');
      }
      this.container = container;
    }

    /**
     * Draws boardEl with specific theme
     *
     * @param theme
     */
  }, {
    key: "drawUi",
    value: function drawUi(theme) {
      var _this = this;
      this.checkBinding();
      this.container.innerHTML = "\n      <div class=\"controls\">\n        <button data-id=\"action-restart\" class=\"btn\">New Game</button>\n        <button data-id=\"action-save\" class=\"btn\">Save Game</button>\n        <button data-id=\"action-load\" class=\"btn\">Load Game</button>\n      </div>\n      <div class=\"board-container\">\n        <div data-id=\"board\" class=\"board\"></div>\n      </div>\n    ";
      this.newGameEl = this.container.querySelector('[data-id=action-restart]');
      this.saveGameEl = this.container.querySelector('[data-id=action-save]');
      this.loadGameEl = this.container.querySelector('[data-id=action-load]');
      this.newGameEl.addEventListener('click', function (event) {
        return _this.onNewGameClick(event);
      });
      this.saveGameEl.addEventListener('click', function (event) {
        return _this.onSaveGameClick(event);
      });
      this.loadGameEl.addEventListener('click', function (event) {
        return _this.onLoadGameClick(event);
      });
      this.boardEl = this.container.querySelector('[data-id=board]');
      this.boardEl.classList.add(theme);
      for (var i = 0; i < Math.pow(this.boardSize, 2); i += 1) {
        var cellEl = document.createElement('div');
        cellEl.classList.add('cell', 'map-tile', "map-tile-".concat((0, _utils.calcTileType)(i, this.boardSize)));
        cellEl.addEventListener('mouseenter', function (event) {
          return _this.onCellEnter(event);
        });
        cellEl.addEventListener('mouseleave', function (event) {
          return _this.onCellLeave(event);
        });
        cellEl.addEventListener('click', function (event) {
          return _this.onCellClick(event);
        });
        this.boardEl.appendChild(cellEl);
      }
      this.cells = Array.from(this.boardEl.children);
    }

    /**
     * Draws positions (with chars) on boardEl
     *
     * @param positions array of PositionedCharacter objects
     */
  }, {
    key: "redrawPositions",
    value: function redrawPositions(positions) {
      var _iterator = _createForOfIteratorHelper(this.cells),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cell = _step.value;
          cell.innerHTML = '';
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(positions),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var position = _step2.value;
          var cellEl = this.boardEl.children[position.position];
          var charEl = document.createElement('div');
          charEl.classList.add('character', position.character.type);
          var healthEl = document.createElement('div');
          healthEl.classList.add('health-level');
          var healthIndicatorEl = document.createElement('div');
          healthIndicatorEl.classList.add('health-level-indicator', "health-level-indicator-".concat((0, _utils.calcHealthLevel)(position.character.health)));
          healthIndicatorEl.style.width = "".concat(position.character.health, "%");
          healthEl.appendChild(healthIndicatorEl);
          charEl.appendChild(healthEl);
          cellEl.appendChild(charEl);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    /**
     * Add listener to mouse enter for cell
     *
     * @param callback
     */
  }, {
    key: "addCellEnterListener",
    value: function addCellEnterListener(callback) {
      this.cellEnterListeners.push(callback);
    }

    /**
     * Add listener to mouse leave for cell
     *
     * @param callback
     */
  }, {
    key: "addCellLeaveListener",
    value: function addCellLeaveListener(callback) {
      this.cellLeaveListeners.push(callback);
    }

    /**
     * Add listener to mouse click for cell
     *
     * @param callback
     */
  }, {
    key: "addCellClickListener",
    value: function addCellClickListener(callback) {
      this.cellClickListeners.push(callback);
    }

    /**
     * Add listener to "New Game" button click
     *
     * @param callback
     */
  }, {
    key: "addNewGameListener",
    value: function addNewGameListener(callback) {
      this.newGameListeners.push(callback);
    }

    /**
     * Add listener to "Save Game" button click
     *
     * @param callback
     */
  }, {
    key: "addSaveGameListener",
    value: function addSaveGameListener(callback) {
      this.saveGameListeners.push(callback);
    }

    /**
     * Add listener to "Load Game" button click
     *
     * @param callback
     */
  }, {
    key: "addLoadGameListener",
    value: function addLoadGameListener(callback) {
      this.loadGameListeners.push(callback);
    }
  }, {
    key: "onCellEnter",
    value: function onCellEnter(event) {
      event.preventDefault();
      var index = this.cells.indexOf(event.currentTarget);
      this.cellEnterListeners.forEach(function (o) {
        return o.call(null, index);
      });
    }
  }, {
    key: "onCellLeave",
    value: function onCellLeave(event) {
      event.preventDefault();
      var index = this.cells.indexOf(event.currentTarget);
      this.cellLeaveListeners.forEach(function (o) {
        return o.call(null, index);
      });
    }
  }, {
    key: "onCellClick",
    value: function onCellClick(event) {
      var index = this.cells.indexOf(event.currentTarget);
      this.cellClickListeners.forEach(function (o) {
        return o.call(null, index);
      });
    }
  }, {
    key: "onNewGameClick",
    value: function onNewGameClick(event) {
      event.preventDefault();
      this.newGameListeners.forEach(function (o) {
        return o.call(null);
      });
    }
  }, {
    key: "onSaveGameClick",
    value: function onSaveGameClick(event) {
      event.preventDefault();
      this.saveGameListeners.forEach(function (o) {
        return o.call(null);
      });
    }
  }, {
    key: "onLoadGameClick",
    value: function onLoadGameClick(event) {
      event.preventDefault();
      this.loadGameListeners.forEach(function (o) {
        return o.call(null);
      });
    }
  }, {
    key: "selectCell",
    value: function selectCell(index) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yellow';
      this.deselectCell(index);
      this.cells[index].classList.add('selected', "selected-".concat(color));
    }
  }, {
    key: "deselectCell",
    value: function deselectCell(index) {
      var _cell$classList;
      var cell = this.cells[index];
      (_cell$classList = cell.classList).remove.apply(_cell$classList, _toConsumableArray(Array.from(cell.classList).filter(function (o) {
        return o.startsWith('selected');
      })));
    }
  }, {
    key: "showCellTooltip",
    value: function showCellTooltip(message, index) {
      this.cells[index].title = message;
    }
  }, {
    key: "hideCellTooltip",
    value: function hideCellTooltip(index) {
      this.cells[index].title = '';
    }
  }, {
    key: "showDamage",
    value: function showDamage(index, damage) {
      var _this2 = this;
      return new Promise(function (resolve) {
        var cell = _this2.cells[index];
        var damageEl = document.createElement('span');
        damageEl.textContent = damage;
        damageEl.classList.add('damage');
        cell.appendChild(damageEl);
        damageEl.addEventListener('animationend', function () {
          cell.removeChild(damageEl);
          resolve();
        });
      });
    }
  }, {
    key: "setCursor",
    value: function setCursor(cursor) {
      this.boardEl.style.cursor = cursor;
    }
  }, {
    key: "checkBinding",
    value: function checkBinding() {
      if (this.container === null) {
        throw new Error('GamePlay not bind to DOM');
      }
    }
  }], [{
    key: "showError",
    value: function showError(message) {
      alert(message);
    }
  }, {
    key: "showMessage",
    value: function showMessage(message) {
      alert(message);
    }
  }]);
}();