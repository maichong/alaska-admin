/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-11
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default async function (ctx, next) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let id = ctx.request.body.id || ctx.request.body._id;
  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }
  let ability = `admin.${serviceId}.${modelName}.`.toLowerCase();
  if (id) {
    ability += 'update';
  } else {
    ability += 'create';
  }
  await ctx.checkAbility(ability);
  let service = ctx.alaska._services[serviceId];
  if (!service) {
    alaska.error('Invalid parameters');
  }
  let Model = service.model(modelName);
  if (!Model) {
    alaska.error('Invalid parameters');
  }

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

  await record.save();

  ctx.body = record;
}
