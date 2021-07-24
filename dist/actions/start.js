"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

var _games = require("../games");

var start = {
  params: {},
  handler: function () {
    var _handler = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
      var params, nodeID, lobby, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = _ref.params, nodeID = _ref.nodeID;
              _context.next = 3;
              return _database["default"].hgetall(params.lobby);

            case 3:
              lobby = _context.sent;

              if (!(lobby.owner !== params.username)) {
                _context.next = 6;
                break;
              }

              throw new Error("Only the lobby owner can start the game");

            case 6:
              _context.next = 8;
              return _database["default"].hmset(params.lobby, "state", "STARTING");

            case 8:
              result = _context.sent;
              (0, _games.startGame)(params);
              return _context.abrupt("return", {
                nodeID: nodeID
              });

            case 11:
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
exports.start = start;