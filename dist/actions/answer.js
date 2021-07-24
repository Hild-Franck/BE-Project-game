"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.answer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

var _games = _interopRequireWildcard(require("../games"));

var answer = {
  params: {},
  handler: function () {
    var _handler = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
      var params, game, answer, response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = _ref.params;
              game = _games["default"][params.lobby];
              if (!game.answers[params.username]) game.answers[params.username] = [];

              if (!(params.level != game.level)) {
                _context.next = 5;
                break;
              }

              throw new Error("Not the right level");

            case 5:
              if (!game.answers[params.username][game.level]) {
                _context.next = 7;
                break;
              }

              throw new Error("Already answered");

            case 7:
              answer = params.answer == game.answer;

              if (!(game.mode === "br")) {
                _context.next = 12;
                break;
              }

              if (game.players[params.username]) {
                _context.next = 11;
                break;
              }

              throw new Error("No life remaining");

            case 11:
              if (!answer) game.players[params.username]--;

            case 12:
              game.answers[params.username][game.level] = answer;
              response = {
                username: params.username,
                answer: answer,
                level: game.level,
                lobby: params.lobby
              };
              if (game.mode === "br") response.lives = game.players[params.username];
              return _context.abrupt("return", response);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function handler(_x) {
      return _handler.apply(this, arguments);
    }

    return handler;
  }()
};
exports.answer = answer;