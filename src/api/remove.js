/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

export default async function remove(ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.state.service || ctx.query.service;
  let modelName = ctx.state.model || ctx.query.model;
  let id = ctx.state.id || ctx.request.body.id;

  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }

  let s = ctx.alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let ability = `admin.${Model.key}.remove`;
  await ctx.checkAbility(ability);

  let record = await Model.findById(id);
  if (!record) {
    alaska.error('Record not found');
  }

  await alaska.try(record.remove());

  ctx.body = record;
}
