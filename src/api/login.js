/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

import service from '../';
import USER from 'alaska-user';
import SETTINGS from 'alaska-settings';

async function getLogo(key) {
  let logo = '';
  let pic = await SETTINGS.get(key);
  if (pic && pic.url) {
    logo = pic.url;
  }
  return logo;
}

export async function login(ctx) {
  let username = ctx.request.body.username || service.error('Username is required');
  let password = ctx.request.body.password || service.error('Password is required');
  let user = await USER.run('Login', { ctx, username, password });
  let access = await user.hasAbility('admin');
  let settings = {
    locales: {
      'alaska-admin': service.locales
    }
  };
  if (access) {
    settings = await service.settings(user);
  }
  settings.locale = ctx.locale;
  settings.logoReverse = await getLogo('adminLogoReverse');
  settings.logo = await getLogo('adminLogo');
  settings.icon = await getLogo('adminIcon');
  ctx.body = {
    signed: true,
    user: user.data(),
    access,
    settings
  };
}

export async function logout(ctx) {
  await USER.run('Logout', { ctx });
  ctx.body = {};
}

export async function info(ctx) {
  let user = ctx.user;
  const logoReverse = await getLogo('adminLogoReverse');
  const logo = await getLogo('adminLogo');
  const icon = await getLogo('adminIcon');
  if (!user) {
    ctx.body = {
      signed: false,
      settings: {
        locales: {
          'alaska-admin': service.locales
        },
        locale: ctx.locale,
        logoReverse,
        logo,
        icon
      }
    };
    return;
  }
  ctx.session.lastAlive = Date.now();
  let access = await user.hasAbility('admin');
  let settings = {};
  if (access) {
    settings = await service.settings(user);
  } else {
    settings.locales = {
      'alaska-admin': service.locales
    };
  }
  settings.locale = ctx.locale;
  settings.logo = logo;
  settings.icon = icon;
  ctx.body = {
    signed: true,
    user: user.data(),
    access,
    settings
  };
}
