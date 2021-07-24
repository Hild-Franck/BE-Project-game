"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sync = _interopRequireDefault(require("csv-parse/lib/sync"));

var _history = _interopRequireDefault(require("../questions/history.json"));

var parsed = (0, _sync["default"])(_history["default"].data, {
  delimiter: ",",
  columns: true,
  skip_empty_lines: true
});
var questions = [function () {
  var data = parsed[Math.floor(Math.random() * parsed.length)];
  return {
    proposition: "".concat(data.desc, "\n").concat(data.region),
    answer: data.year
  };
}];
var historyEvents = {
  category: "histoire",
  subcategory: "evenements",
  difficulties: [function () {
    return questions[0]();
  }]
};
var _default = historyEvents;
exports["default"] = _default;