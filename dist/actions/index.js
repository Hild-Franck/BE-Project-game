"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _start = require("./start");

Object.keys(_start).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _start[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _start[key];
    }
  });
});

var _answer = require("./answer");

Object.keys(_answer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _answer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _answer[key];
    }
  });
});