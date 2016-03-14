'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-03-14
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

exports.default = function () {
  var ref = _asyncToGenerator(function* (ctx, next) {
    yield ctx.checkAbility('admin');
    let serviceId = ctx.query.service;
    let modelName = ctx.query.model;
    let id = ctx.request.body.id;
    let path = ctx.request.body.path;
    if (!serviceId || !modelName || !path) {
      _alaska2.default.error('Invalid parameters');
    }
    let ability = `admin.${ serviceId }.${ modelName }.`.toLowerCase();
    if (id) {
      ability += 'update';
    } else {
      ability += 'create';
    }
    yield ctx.checkAbility(ability);
    let service = ctx.alaska._services[serviceId];
    if (!service) {
      _alaska2.default.error('Invalid parameters');
    }
    let Model = service.model(modelName);
    if (!Model || !Model.fields[path]) {
      _alaska2.default.error('Invalid parameters');
    }

    let FieldType = Model.fields[path].type;
    if (!FieldType || !FieldType.upload) {
      _alaska2.default.error('Invalid field');
    }
    ctx.body = yield FieldType.upload(ctx.files.file, Model.fields[path], Model);
  });

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}();