/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-08-16
 * @author Liang <liang@maichong.it>
 */

import service from '../';

export default function (router) {
  let superMode = service.config('superMode');
  if (typeof superMode === 'string') {
    superMode = {
      cookie: superMode
    };
  }
  router.use(function (ctx, next) {
    ctx.state.superMode = false;
    if (superMode === true) {
      ctx.state.superMode = true;
    } else if (superMode) {
      if (superMode.cookie && ctx.cookies.get(superMode.cookie)) {
        ctx.state.superMode = true;
      } else if (ctx.user) {
        if (superMode.userId && superMode.userId === ctx.user.id) {
          ctx.state.superMode = true;
        } else if (superMode.username && superMode.username === ctx.user.username) {
          ctx.state.superMode = true;
        }
      }
    }
    return next();
  });
}
