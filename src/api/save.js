/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-11
 * @author Liang <liang@maichong.it>
 */

export default async function (ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let id = ctx.request.body.id;
  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }

  let s = ctx.alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let ability = `admin.${Model.key}.`;
  if (id) {
    ability += 'update';
  } else {
    ability += 'create';
  }
  await ctx.checkAbility(ability);

  let record;
  if (id) {
    record = await Model.findById(id);
    if (!record) {
      alaska.error('Record not found');
    }
  } else {
    record = new Model();
  }
  record.set(ctx.request.body);

  await alaska.try(record.save());

  ctx.body = record;
}
