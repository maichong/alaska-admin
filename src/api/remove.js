/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

const service = __service;
const alaska = service.alaska;

export default async function remove(ctx, next) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let id = ctx.request.body.id;

  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }
  let ability = `admin.${serviceId}.${modelName}.remove`.toLowerCase();
  await ctx.checkAbility(ability);
  let service = ctx.alaska.services[serviceId];
  if (!service) {
    alaska.error('Invalid parameters');
  }
  let Model = service.model(modelName);

  let record = await Model.findById(id);
  if (!record) {
    alaska.error('Record not found');
  }

  await alaska.try(record.remove());

  ctx.body = record;
}
