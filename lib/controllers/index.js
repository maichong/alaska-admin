'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @copyright Maichong Software Ltd. 2015 http://maichong.it
 * @date 2015-11-19
 * @author Liang <liang@maichong.it>
 */

let index = exports.index = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    if (!ctx.path.endsWith('/') && ctx.path.lastIndexOf('/') < 1) {
      return ctx.redirect(ctx.path + '/');
    }
    yield ctx.show('index.swig', {
      prefix: ctx.service.config('prefix')
    });
  });

  return function index(_x) {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }