/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

const service = __service;
const userService = service.service('user');

export async function login(ctx) {
  let username = ctx.request.body.username || service.error('Username is required!');
  let password = ctx.request.body.password || service.error('Password is required!');
  let user = await userService.login(ctx, username, password);
  ctx.body = {
    user: user.id
  };
}
