/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-11
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';
export default async function (ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let keyword = ctx.query.search || '';
  let page = parseInt(ctx.query.page) || 1;
  let perPage = parseInt(ctx.query.perPage) || 1000;

  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }
  let s = alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let ability = `admin.${Model.key}.read`;
  await ctx.checkAbility(ability);

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

  let results = await query;

  ctx.body = {
    service: serviceId,
    model: modelName,
    next: results.next,
    total: results.total,
    results: _.map(results.results, record => {
      let tmp = {
        value: record.id
      };
      tmp.label = record[titleField] || tmp.id;
      return tmp;
    })
  };
}
