/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default async function (ctx, next) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.query.service;
  let modelName = ctx.query.model;
  let id = ctx.request.body.id;
  let path = ctx.request.body.path;
  if (!serviceId || !modelName || !path) {
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
  if (!Model || !Model.fields[path]) {
    alaska.error('Invalid parameters');
  }

  let FieldType = Model.fields[path].type;
  if (!FieldType || !FieldType.upload) {
    alaska.error('Invalid field');
  }
  ctx.body = await FieldType.upload(ctx.files.file, Model.fields[path], Model);
}