/**
 * @copyright Maichong Software Ltd. 2015 http://maichong.it
 * @date 2015-11-19
 * @author Liang <liang@maichong.it>
 */

export async function index(ctx) {
  if (!ctx.path.endsWith('/') && ctx.path.lastIndexOf('/') < 1) {
    return ctx.redirect(ctx.path + '/');
  }
  await ctx.show('index.swig', {
    prefix: ctx.service.config('prefix')
  });
}
