/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-04
 * @author Liang <liang@maichong.it>
 */

export default async function list(ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.state.service || ctx.query.service;
  let modelName = ctx.state.model || ctx.query.model;
  let keyword = ctx.state.search || ctx.query.search || '';
  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }
  let s = ctx.alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let ability = `admin.${Model.key}.read`;
  await ctx.checkAbility(ability);

  let filters = Model.createFilters(keyword, ctx.state.filters || ctx.query.filters);

  let query = Model.paginate({
    page: parseInt(ctx.state.page || ctx.query.page) || 1,
    perPage: parseInt(ctx.query.perPage || ctx.query.perPage) || 50,
    filters
  });

  let sort = ctx.state.sort || ctx.query.sort || Model.defaultSort;
  if (sort) {
    query.sort(sort);
  }

  ctx.body = await query;
}
