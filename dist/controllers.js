"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _uuid = require("uuid");

var _database = _interopRequireDefault(require("./database"));

var _broker = _interopRequireDefault(require("./broker"));

var _logger = _interopRequireDefault(require("./logger"));

var controllers = {
  CREATE_LOBBY: function () {
    var _CREATE_LOBBY = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data, user) {
      var id;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = (0, _uuid.v4)();
              _context.next = 3;
              return _database["default"].hmset(id, "id", id, "owner", user.username, "private", !!data["private"], "type", data.type, "state", "PENDING");

            case 3:
              if (data["private"]) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return _database["default"].sadd("lobbies", id);

            case 6:
              _context.next = 8;
              return _database["default"].sadd("players:".concat(id), user.username);

            case 8:
              _logger["default"].info("Creating lobby ".concat(id, " !"));

              return _context.abrupt("return", {
                lobby: id
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function CREATE_LOBBY(_x, _x2) {
      return _CREATE_LOBBY.apply(this, arguments);
    }

    return CREATE_LOBBY;
  }(),
  JOIN_LOBBY: function () {
    var _JOIN_LOBBY = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data, user) {
      var lobby;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _database["default"].hgetall(data.lobby);

            case 2:
              lobby = _context2.sent;
              _context2.next = 5;
              return _database["default"].sadd("players:".concat(data.lobby), user.username);

            case 5:
              _logger["default"].info("".concat(user.username, " joined lobby ").concat(data.lobby, " !"));

              _broker["default"].broadcast("lobby.join", {
                type: 'LOBBY_JOIN',
                username: user.username,
                id: data.lobby
              });

              return _context2.abrupt("return", lobby);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function JOIN_LOBBY(_x3, _x4) {
      return _JOIN_LOBBY.apply(this, arguments);
    }

    return JOIN_LOBBY;
  }()
};
var _default = controllers;
exports["default"] = _default;