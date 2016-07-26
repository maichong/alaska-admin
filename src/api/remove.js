/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default async function remove(ctx) {
  await ctx.checkAbility('admin');
  let serviceId = ctx.state.service || ctx.query.service;
  let modelName = ctx.state.model || ctx.query.model;
  let body = ctx.state.body || ctx.request.body;
  let id = body.id || ctx.request.body.id;
  let records = body.records || ctx.request.body.records;

  if (!serviceId || !modelName) {
    alaska.error('Invalid parameters');
  }

  let s = alaska.services[serviceId];
  if (!s) {
    alaska.error('Invalid parameters');
  }
  let Model = s.model(modelName);

  let ability = `admin.${Model.key}.remove`;
  await ctx.checkAbility(ability);

  if (id) {
    let record = await Model.findById(id);
    if (!record) {
      alaska.error('Record not found');
    }

    await alaska.try(record.remove());
  } else if (records) {
    for (let i in records) {
      let record = await Model.findById(records[i]);
      if (record) {
        await alaska.try(record.remove());
      }
    }
  } else {
    alaska.error('id not found');
  }

  ctx.body = {};
}
