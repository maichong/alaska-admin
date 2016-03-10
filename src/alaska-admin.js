/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import * as _ from 'lodash';

export default class AdminService extends alaska.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-admin';
    options.dir = __dirname;
    super(options, alaska);
  }

  async postLoadModels() {
    let userService = this.service('user');

    let abilities = [{
      id: 'admin',
      title: '登录管理平台'
    }];
    let roles = [{
      id: 'admin',
      title: '管理员',
      abilities: ['admin']
    }];

    for (let ability of abilities) {
      ability.service = this.id;
      await userService.registerAbility(ability);
    }
    for (let role of roles) {
      role.service = this.id;
      await userService.registerRole(role);
    }
  }

  async preRoute() {
    //配置管理员菜单
    let alaska = this.alaska;
    let userService = this.service('user');
    let AdminMenu = this.model('AdminMenu');
    let menus = _.reduce(await AdminMenu.find(), (res, menu)=> {
      res[menu._id] = menu;
      return res;
    }, {});

    for (let serviceId in alaska._services) {
      let service = alaska._services[serviceId];
      for (let modelName in service._models) {
        let Model = service._models[modelName];
        let ability = `admin.${service.id}.${Model.name}.`.toLowerCase();
        ['read', 'create', 'remove', 'update'].forEach(action => {
          userService.registerAbility({
            id: ability + action,
            title: `${action} ${Model.name}`,
            service: 'alaska-admin'
          });
        });
        if (Model.hidden) {
          continue;
        }
        let id = `model.${service.id}.${Model.name}`.toLowerCase();
        if (menus[id]) {
          continue;
        }
        (new AdminMenu({
          _id: id,
          label: Model.label,
          type: 'link',
          link: `/list/${service.id}/${Model.name}`,
          ability: ability + 'read',
          activated: true
        })).save();
      }
    }
  }

  /**
   * 获取管理平台前台配置
   * @param user
   * @returns {{}}
   */
  async getSettings(user) {

    let alaska = this.alaska;

    let services = {};

    for (let serviceId in alaska._services) {
      let service = alaska._services[serviceId];
      let settings = {};
      settings.id = serviceId;
      settings.domain = service.config('domain');
      settings.prefix = service.config('prefix');
      settings.api = service.config('api');
      settings.models = {};
      for (let modelName in service._models) {
        let Model = service._models[modelName];
        if (!Model || Model.hidden) {
          continue;
        }
        let model = {
          name: Model.name,
          label: Model.label,
          title: Model.title,
          sort: Model.sort,
          defaultSort: Model.defaultSort,
          defaultColumns: Model.defaultColumns,
          nocreate: Model.nocreate,
          noedit: Model.noedit,
          noremove: Model.noremove,
          groups: Model.groups,
          fields: {}
        };
        if (!model.defaultColumns) {
          model.defaultColumns = ['_id'];
          if (Model.title && Model.fields[Model.title]) {
            model.defaultColumns.push(model.title);
          }
          if (Model.fields.createdAt) {
            model.defaultColumns.push('createdAt');
          }
        }
        if (typeof model.defaultColumns === 'string') {
          model.defaultColumns = model.defaultColumns.replace(/ /g, '').split(',');
        }
        for (let path in Model.fields) {
          let field = Model.fields[path];
          let options;
          if (field.type.viewOptions) {
            options = field.type.viewOptions(field, Model);
          } else {
            options = alaska.Field.viewOptions.call(field.type, field, Model);
          }
          if (options.label == '_ID') {
            options.label = 'ID';
          }
          model.fields[path] = options;
        }
        if (!model.fields._id) {
          model.fields._id = {
            cell: 'TextFieldCell',
            label: 'ID',
            path: '_id',
            view: 'TextFieldView'
          };
        }
        settings.models[Model.name] = model;
      }
      services[service.id] = settings;
    }

    let abilities = {};

    function addAbilities(list) {
      if (list) {
        for (let ability of list) {
          if (typeof ability == 'string') {
            abilities[ability] = true;
          } else if (ability._id) {
            abilities[ability._id] = true;
          }
        }
      }
    }

    addAbilities(user.abilities);

    if (user.roles) {
      let Role = this.model('user.Role');
      for (let role of user.roles) {
        if (typeof role == 'string') {
          role = await Role.getCache(role);
        }
        if (role) {
          addAbilities(role.abilities);
        }
      }
    }

    let isSuperUser = user.id == this.config(true, 'superUser');

    let AdminMenu = this.model('AdminMenu');
    let menu = [];
    let menuMap = _.reduce(await AdminMenu.find({ activated: true }).sort('-sort'), (res, item) => {
      item = item.data();
      if (!item.ability || abilities[item.ability] || isSuperUser) {
        delete item.ability;
        res[item.id] = item;
        menu.push(res[item.id]);
      }
      return res;
    }, {});

    _.each(menu, item => {
      if (item.subs) {
        item.subs = _.reduce(item.subs, ((res, subId) => {
          menuMap[subId].isSub = true;
          res.push(menuMap[subId]);
          return res;
        }), []);
      }
    });

    return {
      services,
      abilities,
      menu: _.filter(menu, map => !map.isSub)
    };
  }


  async registerMenu(data) {
    let AdminMenu = this.model('AdminMenu');
    let record = AdminMenu.getCache(data.id);
    if (record) {
      return record;
    }

    record = new AdminMenu(data);

    record._id = data.id;

    await record.save();

    return record;
  }
}
