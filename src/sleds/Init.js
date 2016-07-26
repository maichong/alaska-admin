/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';
import alaska from 'alaska';
import service from '../';
import SETTINGS from 'alaska-settings';
import USER from 'alaska-user';
import RegisterMenu from './RegisterMenu';
import AdminMenu from '../models/AdminMenu';

/**
 * 自动已经系统中所有的模型,注册管理员后台菜单
 */
export default class Init extends alaska.Sled {
  async exec() {

    RegisterMenu.run({
      id: 'admin.settings',
      label: 'Settings',
      icon: 'cogs',
      type: 'link',
      link: `/settings`,
      ability: ['admin.alaska-settings.settings.update'],
      service: 'alaska-settings',
      activated: true
    });

    SETTINGS.register({
      id: 'adminLogo',
      title: 'Admin Logo',
      service: 'alaska-admin',
      type: 'ImageFieldView'
    });

    SETTINGS.register({
      id: 'adminLogoReverse',
      title: 'Admin Logo Reverse',
      service: 'alaska-admin',
      type: 'ImageFieldView'
    });

    SETTINGS.register({
      id: 'adminIcon',
      title: 'Admin Icon',
      service: 'alaska-admin',
      type: 'ImageFieldView'
    });

    USER.run('RegisterAbility', {
      id: 'admin',
      title: 'Admin login',
      service: 'alaska-admin'
    });
    await USER.run('RegisterRole', {
      id: 'admin',
      title: 'Admin',
      abilities: ['admin']
    });
    const root = await USER.run('RegisterRole', {
      id: 'root',
      title: 'Root',
      abilities: ['admin']
    });
    let menus = _.reduce(await AdminMenu.find(), (res, menu) => {
      res[menu._id] = menu;
      return res;
    }, {});

    for (let serviceId in alaska.services) {
      let ser = alaska.services[serviceId];
      for (let modelName in ser.models) {
        let Model = ser.models[modelName];
        let ability = `admin.${Model.key}.`.toLowerCase();

        function registerAbility(action) {
          let id = ability + action;
          USER.run('RegisterAbility', {
            id,
            title: `${action} ${Model.name}`,
            service: 'alaska-admin'
          });
          if (root.abilities.indexOf(id) < 0) {
            root.abilities.push(id);
          }
        }

        ['read', 'create', 'remove', 'update'].forEach(registerAbility);
        _.keys(Model.actions).forEach(registerAbility);
        if (Model.hidden) {
          continue;
        }
        let id = `model.${Model.key}`.toLowerCase();
        if (menus[id]) {
          continue;
        }
        RegisterMenu.run({
          id,
          label: Model.label,
          icon: Model.icon,
          type: 'link',
          link: `/list/${ser.id}/${Model.name}`,
          ability: [ability + 'read'],
          service: serviceId,
          activated: true
        }).catch(e => console.error(e.stack));
      }
    }
    root.save();
  }
}
