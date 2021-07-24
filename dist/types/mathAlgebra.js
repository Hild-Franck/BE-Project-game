"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var randomInt = function randomInt() {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return Math.floor(min + Math.random() * (max - min));
};

var symbols = ["+", "-", "*", "/"];
var symbolMapping = {
  "+": {
    leftMember: function leftMember(mod) {
      return mod ? randomInt(30 * mod, -30 * mod) : randomInt();
    },
    rightMember: function rightMember(mod) {
      return mod ? randomInt(30 * mod, -30 * mod) : randomInt();
    }
  },
  "-": {
    leftMember: function leftMember(mod) {
      return mod ? randomInt(30 * mod, -30 * mod) : randomInt(30, 5);
    },
    rightMember: function rightMember(mod, previous) {
      return mod ? randomInt(30 * mod, -30 * mod) : randomInt(previous);
    }
  },
  "*": {
    leftMember: function leftMember(mod) {
      return mod ? randomInt(11, 3) : randomInt(10, 2);
    },
    rightMember: function rightMember(mod) {
      return mod ? randomInt(11, 3) : randomInt(10, 2);
    }
  },
  "/": {
    leftMember: function leftMember(mod) {
      return mod ? randomInt(30 * mod, 6) : randomInt(30, 6);
    },
    rightMember: function rightMember(_, previous) {
      var dividers = [1];

      for (var i = 2; i < Math.sqrt(previous); i++) {
        if (previous % i === 0) {
          dividers.push(i);
          if (previous / i !== i) dividers.push(previous / i);
        }
      }

      return dividers[Math.floor(Math.random() * dividers.length)];
    }
  }
};
var questions = [function (mod) {
  var symbol = symbols[Math.floor(Math.random() * symbols.length)];
  var leftMember = symbolMapping[symbol].leftMember(mod);
  var rightMember = symbolMapping[symbol].rightMember(mod, leftMember);
  var proposition = "".concat(leftMember, " ").concat(symbol, " ").concat(rightMember);
  return {
    proposition: proposition,
    answer: eval(proposition)
  };
}, function () {
  var leftMember = randomInt(15, 2);
  var answer = randomInt(15, 2);
  var additionMember = randomInt(15, 2);
  var rightMember = eval("".concat(leftMember, " * ").concat(answer, " + ").concat(additionMember));
  var proposition = "".concat(leftMember, "\uD835\uDC99 + ").concat(additionMember, " = ").concat(rightMember);
  return {
    proposition: proposition,
    answer: answer
  };
}, function () {
  var a = randomInt(9, 2);
  var b = randomInt(9, 2);
  var proposition = "(".concat(a, " + ").concat(b, ")\xB2");
  var answer = Math.pow(a, 2) + 2 * a * b + Math.pow(b, 2);
  return {
    proposition: proposition,
    answer: answer
  };
}];
var mathAlgebra = {
  category: "math",
  subcategory: "algebra",
  difficulties: [function () {
    return questions[0]();
  }, function () {
    var question = randomInt(3, 0);
    return questions[question](5);
  }]
};
var _default = mathAlgebra;
exports["default"] = _default;