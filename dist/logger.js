"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.loggingOptions = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _configs = require("./configs");

var _winston$format = _winston["default"].format,
    combine = _winston$format.combine,
    timestamp = _winston$format.timestamp,
    prettyPrint = _winston$format.prettyPrint,
    printf = _winston$format.printf,
    align = _winston$format.align,
    colorize = _winston$format.colorize,
    json = _winston$format.json;
var customLevels = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  colors: {
    crit: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'white',
    debug: 'grey'
  }
};
var logLevel = process.env.LOG_LEVEL || process.env.NODE_ENV == 'development' && 'debug' || 'info';
var timeFormat = 'DD-MM-YYYY HH:mm:ss';
var format = process.env.NODE_ENV === 'production' ? combine(timestamp({
  format: timeFormat
}), json()) : combine(_winston["default"].format(function (info) {
  info.level = info.level.toUpperCase();
  return info;
})(), align(), timestamp({
  format: timeFormat
}), colorize(), printf(function (_ref) {
  var level = _ref.level,
      message = _ref.message,
      label = _ref.label,
      timestamp = _ref.timestamp,
      meta = _ref.meta;
  var labelDisplay = label ? "[".concat(label, "]") : "";
  var infoDisplay = "[".concat(timestamp, "][").concat(level, "]").concat(labelDisplay);
  var metaDisplay = meta ? "\n".concat(JSON.stringify(meta, null, 2)) : '';
  return "".concat(_configs.appConfig.name, ".").concat(_configs.appConfig.version, " ").concat(infoDisplay, " ").concat(message).concat(metaDisplay);
}));
var loggingOptions = {
  levels: customLevels.levels,
  level: logLevel,
  transports: [new _winston["default"].transports.Console({
    format: format
  })],
  format: combine(timestamp(), prettyPrint())
};
exports.loggingOptions = loggingOptions;

var logger = _winston["default"].createLogger(loggingOptions);

_winston["default"].addColors(customLevels.colors);

logger.stream = {
  write: function write(message) {
    return logger.info(message, {
      label: 'express'
    });
  }
};
var _default = logger;
exports["default"] = _default;