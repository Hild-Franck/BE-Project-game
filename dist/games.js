"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.startGame = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _reduce = _interopRequireDefault(require("lodash/reduce"));

var _filter = _interopRequireDefault(require("lodash/filter"));

var _broker = _interopRequireDefault(require("./broker"));

var _database = _interopRequireDefault(require("./database"));

var _types = _interopRequireDefault(require("./types"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var startingTime = process.eventNames.STARTING_TINE || 3000;
var games = {};

var setBrTime = function setBrTime(previousTime, level) {
  if (level % 3 !== 0) return previousTime;
  if (previousTime > 10) return previousTime - 5;
  return previousTime - 1;
};

var updateGame = function updateGame(lobbyData, game, mode, time, gameType, numberOfRounds, data) {
  var _lobbyData$difficulty;

  if (mode == "br") {
    (0, _forEach["default"])(game.answers, function (a, b) {
      if (a[game.level] == undefined) {
        game.players[b]--;

        _broker["default"].broadcast("lobby.br", {
          type: 'LIFE_LOST',
          id: data.lobby,
          username: b
        });
      }
    });
  }

  game.level++;
  var newTime = mode == "br" ? setBrTime(time, game.level) : time;
  var question = gameType.difficulties[(_lobbyData$difficulty = lobbyData.difficulty) !== null && _lobbyData$difficulty !== void 0 ? _lobbyData$difficulty : 0]();
  game.answer = question.answer;
  var playersAlive = (0, _filter["default"])(game.players, function (lives) {
    return lives > 0;
  });

  if (game.level > numberOfRounds && mode != "br" || playersAlive.length <= 1) {
    delete games[data.lobby];
    return _broker["default"].broadcast("lobby.game_end", {
      type: 'GAME_ENDED',
      id: data.lobby,
      level: game.level
    });
  }

  _broker["default"].broadcast("lobby.in_game", {
    type: 'IN_PROGRESS',
    id: data.lobby,
    level: game.level,
    proposition: question.proposition,
    end: Date.now() + newTime * 1000
  });

  setTimeout(updateGame, newTime * 1000, lobbyData, game, mode, newTime, gameType, numberOfRounds, data);
};

var startGame = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var _lobbyData$difficulty2;

    var lobbyData, gameType, mode, game, time, numberOfRounds;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _database["default"].hgetall(data.lobby);

          case 2:
            lobbyData = _context.sent;
            gameType = _types["default"][lobbyData.type];
            mode = lobbyData.mode || "normal";
            games[data.lobby] = _objectSpread({
              level: 1,
              mode: mode,
              answers: (0, _reduce["default"])(data.players, function (acc, username) {
                return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, username, []));
              }, {}),
              players: (0, _reduce["default"])(data.players, function (acc, username) {
                return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, username, 3));
              }, {})
            }, gameType.difficulties[(_lobbyData$difficulty2 = lobbyData.difficulty) !== null && _lobbyData$difficulty2 !== void 0 ? _lobbyData$difficulty2 : 0]());
            game = games[data.lobby];
            time = mode == "br" ? 30 : lobbyData.roundDuration || 10;
            numberOfRounds = lobbyData.numberOfRounds || 10;
            setTimeout(function () {
              _broker["default"].broadcast("lobby.game_start", {
                type: 'GAME_STARTED',
                id: data.lobby,
                level: game.level,
                proposition: game.proposition,
                end: Date.now() + time * 1000
              });

              setTimeout(updateGame, time * 1000, lobbyData, game, mode, time, gameType, numberOfRounds, data);
            }, startingTime);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function startGame(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.startGame = startGame;
var _default = games;
exports["default"] = _default;