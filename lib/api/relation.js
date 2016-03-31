'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-03-11
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

exports.default = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    yield ctx.checkAbility('admin');
    let serviceId = ctx.query.service;
    let modelName = ctx.query.model;
    let keyword = ctx.query.search || '';
    let page = parseInt(ctx.query.page) || 1;
    let perPage = parseInt(ctx.query.perPage) || 100;

    if (!serviceId || !modelName) {
      alaska.error('Invalid parameters');
    }
    let s = alaska.services[serviceId];
    if (!s) {
      alaska.error('Invalid parameters');
    }
    let Model = s.model(modelName);

    let ability = `admin.${ Model.key }.read`;
    yield ctx.checkAbility(ability);

    let titleField = Model.title || 'title';

    let filters = Model.createFilters(keyword, ctx.query.filters);

    let query = Model.paginate({
      page,
      perPage,
      filters
    }).select(titleField);

    let sort = ctx.query.sort || Model.defaultSort;
    if (sort) {
      query.sort(sort);
    }

    let results = yield query;

    ctx.body = {
      service: serviceId,
      model: modelName,
      next: results.next,
      total: results.total,
      results: _lodash2.default.map(results.results, function (record) {
        let tmp = {
          value: record.id
        };
        tmp.label = record[titleField] || tmp.id;
        return tmp;
      })
    };
  });

  return function (_x) {
    return ref.apply(this, arguments);
  };
})();