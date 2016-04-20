/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-14
 * @author Liang <liang@maichong.it>
 */

export default async function (ctx) {
  try {
    await ctx.checkAbility('admin');
    let serviceId = ctx.state.service || ctx.query.service;
    let modelName = ctx.state.model || ctx.query.model;
    let id = ctx.state.id || ctx.request.body.id;
    let path = ctx.state.path || ctx.request.body.path;
    if (!serviceId || !modelName || !path) {
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

    let FieldType = Model.fields[path].type;
    if (!FieldType || !FieldType.upload) {
      alaska.error('Invalid field');
    }
    let img = await FieldType.upload(ctx.files.file, Model.fields[path], Model);
    if (ctx.state.editor || ctx.query.editor) {
      ctx.body = {
        success: true,
        file_path: img.url
      };
    } else {
      ctx.body = img;
    }
  } catch (error) {
    if (ctx.state.editor || ctx.query.editor) {
      ctx.body = {
        success: false,
        msg: error.message
      };
    } else {
      throw error;
    }
  }
}
