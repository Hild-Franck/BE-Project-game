"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _http = _interopRequireDefault(require("http"));

var _logger = _interopRequireDefault(require("../logger"));

var _database = require("../database");

var reqLogger = _logger["default"].child({
  label: 'http-request'
});

var headers = {
  "Content-Type": "application/json; charset=utf-8"
};
var state = {
  data: {
    up: false,
    timestamp: Date.now(),
    err: null
  },
  updateState: function () {
    var _updateState = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _database.sequelize.authenticate();

            case 3:
              state.data.up = true;
              state.data.err = null;
              _context.next = 11;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              state.data.up = false;
              state.data.err = "Unable to connect to database";

            case 11:
              state.data.timestamp = Date.now();

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    }));

    function updateState() {
      return _updateState.apply(this, arguments);
    }

    return updateState;
  }()
};

var requestHandler = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(req.url == '/health')) {
              _context2.next = 7;
              break;
            }

            _context2.next = 3;
            return state.updateState();

          case 3:
            res.writeHead(state.data.up ? 200 : 500, headers);
            res.end(JSON.stringify(state.data, null, 2));
            _context2.next = 9;
            break;

          case 7:
            res.writeHead(404, _http["default"].STATUS_CODES[404], {});
            res.end();

          case 9:
            reqLogger.debug("".concat(res.statusCode, " ").concat(req.method, " ").concat(req.url));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function requestHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var server = _http["default"].createServer(requestHandler);

var _default = {
  created: function created() {
    return server.listen(3000);
  },
  started: function started() {
    return state.data.up = true;
  },
  stopping: function stopping() {
    return state.data.up = false;
  },
  stopped: function stopped() {
    return state.data.up = false && server.close();
  }
};
exports["default"] = _default;