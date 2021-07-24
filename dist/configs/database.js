"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbConfig = void 0;

var _utils = require("../utils");

var config = {
  database: 'pikachu',
  postgres_user: 'pikachu',
  postgres_password: 'jesus',
  options: {
    dialect: "postgres",
    host: "postgres",
    port: "5432"
  }
};
var dbConfig = (0, _utils.overrideConfig)(config);
exports.dbConfig = dbConfig;
dbConfig.options.host = process.env.POSTGRES_HOST || dbConfig.options.host;