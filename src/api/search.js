/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-11
 * @author Liang <liang@maichong.it>
 */

'use strict';

const service = __service;
const alaska = service.alaska;
const _ = require('lodash');

export default async function (ctx, next) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let keyword = ctx.query.search || '';
  let page = parseInt(ctx.query.page) || 1;
  let perPage = parseInt(ctx.query.perPage) || 100;

  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }

  let ability = `admin.${serviceId}.${modelName}.read`.toLowerCase();
  await ctx.checkAbility(ability);

  let s = alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let titleField = Model.title || 'title';
  
  let filters = Model.createFilters(keyword, ctx.query.filters || {});

  let results = await Model.paginate({
    page,
    perPage,
    filters
  }).select(titleField);

  ctx.body = {
    service: serviceId,
    model: modelName,
    next: results.next,
    total: results.total,
    results: _.map(results.results, record => {
      let tmp = {
        _id: record.id
      };
      tmp.title = record[titleField] || tmp.id;
      return tmp;
    })
  };
}
