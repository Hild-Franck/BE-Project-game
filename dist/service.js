"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("./logger"));

var _actions = require("./actions");

var brokerLogger = _logger["default"].child({
  label: "broker"
});

var errorHandler = function errorHandler(ctx, err) {
  brokerLogger.error("[".concat(ctx.action.name, "] ").concat(err.message));
  throw err;
};

var service = {
  name: 'game',
  actions: {
    start: _actions.start,
    answer: _actions.answer
  },
  hooks: {
    error: {
      "*": errorHandler
    }
  }
};
var _default = service;
exports["default"] = _default;