"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.startBroker = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moleculer = require("moleculer");

var _configs = require("./configs");

var _service = _interopRequireDefault(require("./service"));

var _logger = _interopRequireWildcard(require("./logger"));

var broker = new _moleculer.ServiceBroker({
  logger: {
    type: "Winston",
    options: {
      level: _configs.appConfig.log_level,
      winston: _logger.loggingOptions
    }
  },
  requestRetry: 20,
  transporter: "nats://".concat(_configs.appConfig.nats_host, ":").concat(_configs.appConfig.nats_port)
});

var startBroker = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            broker.createService(_service["default"]);
            _context.prev = 1;
            _context.next = 4;
            return broker.start();

          case 4:
            _logger["default"].info('Running with the following config', {
              meta: _configs.appConfig
            });

            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);

            _logger["default"].error(_context.t0.message);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  }));

  return function startBroker() {
    return _ref.apply(this, arguments);
  };
}();

exports.startBroker = startBroker;
var _default = broker;
exports["default"] = _default;