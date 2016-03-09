'use strict';

let index = exports.index = function () {
  var ref = _asyncToGenerator(function* (ctx, next) {
    yield ctx.checkAbility('admin');
    let serviceId = ctx.query.service;
    let modelName = ctx.query.model;
    let keyword = ctx.query.search || '';
    let page = parseInt(ctx.query.page) || 1;

    if (!serviceId || !modelName) {
      alaska.error('Invalid parameters');
    }

    let ability = `admin.${ serviceId }.${ modelName }.read`.toLowerCase();
    yield ctx.checkAbility(ability);

    let s = alaska._services[serviceId];
    if (!s) {
      alaska.error('Invalid parameters');
    }
    let Model = s.model(modelName);
    if (!Model) {
      alaska.error('Invalid parameters');
    }

    let titleField = Model.title || 'title';

    let results = yield Model.paginate({
      page
    }).select(titleField);

    ctx.body = {
      service: serviceId,
      model: modelName,
      pagination: {
        more: !!results.next
      },
      results: _.map(results.results, record => {
        let tmp = {
          id: record.id
        };

        tmp.text = record[titleField] || tmp.id;

        return tmp;
      })
    };
  });

  return function index(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-08
 * @author Liang <liang@maichong.it>
 */

const service = __service;
const alaska = service.alaska;
const _ = require('lodash');