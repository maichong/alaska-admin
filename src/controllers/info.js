/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-26
 * @author Liang <liang@maichong.it>
 */

const service = __service;

export async function index(ctx) {
  ctx.body = {
    logined: false,
    user: {},
    access: false
  };
}
