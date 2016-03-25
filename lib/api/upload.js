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
    try {
      yield ctx.checkAbility('admin');
      let serviceId = ctx.query.service;
      let modelName = ctx.query.model;
      let id = ctx.request.body.id;
      let path = ctx.request.body.path;
      if (!serviceId || !modelName || !path) {
        alaska.error('Invalid parameters');
      }
      let ability = `admin.${ serviceId }.${ modelName }.`.toLowerCase();
      if (id) {
        ability += 'update';
      } else {
        ability += 'create';
      }
      yield ctx.checkAbility(ability);
      let service = ctx.alaska.services[serviceId];
      if (!service) {
        alaska.error('Invalid parameters');
      }
      let Model = service.model(modelName);

      let FieldType = Model.fields[path].type;
      if (!FieldType || !FieldType.upload) {
        alaska.error('Invalid field');
      }
      let img = yield FieldType.upload(ctx.files.file, Model.fields[path], Model);
      if (ctx.query.editor) {
        ctx.body = {
          success: true,
          file_path: img.url
        };
      } else {
        ctx.body = img;
      }
    } catch (error) {
      if (ctx.query.editor) {
        ctx.body = {
          success: false,
          msg: error.message
        };
      } else {
        throw error;
      }
    }
  });

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
})();