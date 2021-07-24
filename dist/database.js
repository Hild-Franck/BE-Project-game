"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _util = require("util");

var _logger = _interopRequireDefault(require("./logger"));

var client = _redis["default"].createClient({
  host: process.env.REDIS_HOST || 'localhost'
});

client.on("error", function (err) {
  return _logger["default"].error(err.message);
});
var _default = {
  get: (0, _util.promisify)(client.get).bind(client),
  set: (0, _util.promisify)(client.set).bind(client),
  del: (0, _util.promisify)(client.del).bind(client),
  hmset: (0, _util.promisify)(client.hmset).bind(client),
  hmget: (0, _util.promisify)(client.hmget).bind(client),
  hincrby: (0, _util.promisify)(client.hincrby).bind(client),
  hgetall: (0, _util.promisify)(client.hgetall).bind(client),
  sadd: (0, _util.promisify)(client.sadd).bind(client),
  srem: (0, _util.promisify)(client.srem).bind(client),
  smembers: (0, _util.promisify)(client.smembers).bind(client)
};
exports["default"] = _default;