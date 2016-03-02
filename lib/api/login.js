'use strict';

let login = exports.login = function () {
  var ref = _asyncToGenerator(function* (ctx) {
    let username = ctx.request.body.username || service.error('Username is required!');
    let password = ctx.request.body.password || service.error('Password is required!');
    let user = yield userService.login(ctx, username, password);
    let access = yield user.hasAbility('admin');
    let settings = {};
    if (access) {
      settings = yield service.getSettings();
    }
    ctx.body = {
      user: user.data(),
      access,
      settings
    };
  });

  return function login(_x) {
    return ref.apply(this, arguments);
  };
}();

let info = exports.info = function () {
  var ref = _asyncToGenerator(function* (ctx) {
    let user = ctx.user;

    if (!user) {
      ctx.body = {
        logined: false
      };
      return;
    }
    let access = yield user.hasAbility('admin');
    let settings = {};
    if (access) {
      settings = yield service.getSettings();
    }
    ctx.body = {
      user: user.data(),
      access,
      settings
    };
  });

  return function info(_x2) {
    return ref.apply(this, arguments);
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

const service = __service;
const userService = service.service('user');