"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overrideConfig = void 0;
var env = process.env;

var overrideConfig = function overrideConfig(config) {
  return Object.keys(config).reduce(function (newConfig, key) {
    var upperCaseKey = key.toUpperCase();
    newConfig[key] = env[upperCaseKey] || config[key];
    return newConfig;
  }, {});
};

exports.overrideConfig = overrideConfig;