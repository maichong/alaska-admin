/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-11
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';
import alaska from 'alaska';

export default async function (ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.state.service || ctx.query.service;
  let modelName = ctx.state.model || ctx.query.model;
  let keyword = ctx.state.search || ctx.query.search || '';
  let value = ctx.state.value || ctx.query.value || '';
  let page = parseInt(ctx.state.page || ctx.query.page) || 1;
  let perPage = parseInt(ctx.state.perPage || ctx.query.perPage) || 100;
  if (ctx.state.all || ctx.query.all) {
    perPage = 10000;
  }

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

  let filters = Model.createFilters(keyword, ctx.state.filters || ctx.query.filters);

  let query = Model.paginate({
    page,
    perPage,
    filters
  }).select(titleField + ' parent');

  let sort = ctx.state.sort || ctx.query.sort || Model.defaultSort;
  if (sort) {
    query.sort(sort);
  }

  let results = await query;

  let recordsMap = {};
  let records = _.map(results.results, record => {
    let tmp = {
      value: record.id
    };
    tmp.label = record[titleField] || tmp.value;
    if (value && value === tmp.value) {
      value = '';
    }
    if (record.parent) {
      tmp.parent = record.parent;
    }
    recordsMap[tmp.value] = true;
    return tmp;
  });

  if (value) {
    if (typeof value === 'string') {
      value = [value];
    } else if (!Array.isArray(value)) {
      value = [];
    }
    for (let id of value) {
      if (recordsMap[id]) continue;
      let record = await Model.findCache(id);
      if (record) {
        let tmp = {
          value: record.id,
          label: record[titleField] || id
        };
        if (record.parent) {
          tmp.parent = record.parent;
        }
        records.unshift(tmp);
      }
    }
  }

  ctx.body = {
    service: serviceId,
    model: modelName,
    next: results.next,
    total: results.total,
    results: records
  };
}
