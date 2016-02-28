"use strict";

let index = exports.index = function () {
  var ref = _asyncToGenerator(function* (ctx) {
    ctx.body = {
      logined: false,
      user: {},
      access: false
    };
  });

  return function index(_x) {
    return ref.apply(this, arguments);
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-26
 * @author Liang <liang@maichong.it>
 */

const service = __service;