/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

const USER = alaska.service('alaska-user');

export async function login(ctx) {
  let username = ctx.request.body.username || service.error('Username is required!');
  let password = ctx.request.body.password || service.error('Password is required!');
  let user = await USER.login(ctx, username, password);
  let access = await user.hasAbility('admin');
  let settings = {
    locales: {
      'alaska-admin': service.locales
    },
    locale: ctx.locale
  };
  if (access) {
    settings = await service.settings(user);
  }
  ctx.body = {
    signed: true,
    user: user.data(),
    access,
    settings
  };
}

export async function logout(ctx) {
  await USER.logout(ctx);
  ctx.body = {};
}

export async function info(ctx) {
  let user = ctx.user;
  if (!user) {
    ctx.body = {
      signed: false,
      settings: {
        locales: {
          'alaska-admin': service.locales
        },
        locale: ctx.locale
      }
    };
    return;
  }
  ctx.session.lastAlive = Date.now();
  let access = await user.hasAbility('admin');
  let settings = {};
  if (access) {
    settings = await service.settings(user);
  }
  settings.locale = ctx.locale;
  ctx.body = {
    signed: true,
    user: user.data(),
    access,
    settings
  };
}
