/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-04
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default async function list(ctx, next) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }
  let ability = `admin.${serviceId}.${modelName}.read`.toLowerCase();
  await ctx.checkAbility(ability);
  let service = ctx.alaska.services[serviceId];
  if (!service) {
    alaska.error('Invalid parameters');
  }
  let Model = service.model(modelName);

  //TODO filters
  let filters = ctx.query.filters || {};

  let results = await Model.paginate({
    page: parseInt(ctx.query.page) || 1,
    perPage: parseInt(ctx.query.perPage) || 20,
    search: (ctx.query.search || '').trim(),
    filters
  });

  ctx.body = results;
}
