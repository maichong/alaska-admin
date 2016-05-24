/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-24
 * @author Liang <liang@maichong.it>
 */


export default async function (ctx) {
  await ctx.checkAbility('admin');

  let serviceId = ctx.state.service || ctx.query.service;
  let modelName = ctx.state.model || ctx.query.model;
  let action = ctx.state.action || ctx.query.action;
  let body = ctx.state.body || ctx.request.body;
  let id = body.id || ctx.request.body.id;

  if (!serviceId || !modelName || !action) {
    alaska.error('Invalid parameters');
  }

  let s = ctx.alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  if (!Model.actions || !Model.actions[action] || !Model.actions[action].sled) service.error('Invalid action');

  let ability = `admin.${Model.key}.${action}`;
  await ctx.checkAbility(ability);

  let record;
  if (id) {
    record = await Model.findById(id);
    if (!record) {
      alaska.error('Record not found');
    }
  }

  const Sled = s.sled(Model.actions[action].sled);

  const recordModelName = Model.name.replace(/^\w/, w=>w.toLowerCase());

  ctx.body = await Sled.run({
    [recordModelName]: record,
    body,
    admin: ctx.user,
    ctx
  });
}