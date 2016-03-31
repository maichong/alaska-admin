/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-07
 * @author Liang <liang@maichong.it>
 */

export default async function list(ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let id = ctx.query.id;
  if (!serviceId || !modelName || !id) {
    alaska.error('Invalid parameters');
  }
  let s = ctx.alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);
  let ability = `admin.${Model.key}.read`;
  await ctx.checkAbility(ability);

  let record = await Model.findById(id);
  if (!record) {
    alaska.error('Record not found');
  }
  ctx.body = record;
}
