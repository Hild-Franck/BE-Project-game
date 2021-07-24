"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appConfig = void 0;

var _utils = require("../utils");

var config = {
  name: 'be-project-game',
  node_env: 'development',
  version: 'development',
  service: 'lobby',
  port: 8082,
  log_level: 'info',
  nats_host: 'localhost',
  nats_port: 4222
};
var appConfig = (0, _utils.overrideConfig)(config);
exports.appConfig = appConfig;