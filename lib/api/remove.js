'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

const service = __service;
const alaska = service.alaska;

exports.default = (() => {
  var ref = _asyncToGenerator(function* (ctx, next) {
    yield ctx.checkAbility('admin');
    let serviceId = ctx.query.service;
    let modelName = ctx.query.model;
    let id = ctx.request.body.id;

    if (!serviceId || !modelName) {
      alaska.error('Invalid parameters');
    }
    let ability = `admin.${ serviceId }.${ modelName }.remove`.toLowerCase();
    yield ctx.checkAbility(ability);
    let service = ctx.alaska.services[serviceId];
    if (!service) {
      alaska.error('Invalid parameters');
    }
    let Model = service.model(modelName);

    let record = yield Model.findById(id);
    if (!record) {
      alaska.error('Record not found');
    }

    yield alaska.try(record.remove());

    ctx.body = record;
  });

  function remove(_x, _x2) {
    return ref.apply(this, arguments);
  }

  return remove;
})();