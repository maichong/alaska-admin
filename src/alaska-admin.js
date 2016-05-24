/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import * as _ from 'lodash';

/**
 * @class AdminService
 */
export default class AdminService extends alaska.Service {
  constructor(options, alaska) {
    options = options || {};
    options.dir = options.dir || __dirname;
    options.id = options.id || 'alaska-admin';
    super(options, alaska);
  }

  postInit() {
    const MAIN = this.alaska.main;
    MAIN.applyConfig({
      '+appMiddlewares': [{
        id: 'koa-bodyparser',
        sort: 1000,
        options: MAIN.config('koa-bodyparser')
      }, {
        id: 'alaska-middleware-upload',
        sort: 1000,
        options: MAIN.config('alaska-middleware-upload')
      }]
    });
  }

  async preMount() {
    if (this.config('autoInit')) {
      let services = Object.keys(this.alaska.services);
      for (let serviceId of services) {
        let Init = this.alaska.service(serviceId).sleds.Init;
        if (Init) {
          await Init.run();
        }
      }
    }
  }

  /**
   * [async] 获取管理平台前台配置
   * @param {User} user
   * @returns {Object}
   */
  async settings(user) {
    let alaska = this.alaska;
    let result = {};
    let services = result.services = {};
    let locales = result.locales = {};

    for (let serviceId in alaska.services) {
      let service = alaska.services[serviceId];
      let settings = {};
      settings.id = serviceId;
      settings.domain = service.config('domain');
      settings.prefix = service.config('prefix');
      settings.api = service.config('api');
      settings.models = {};
      locales[serviceId] = service.locales;
      for (let modelName in service.models) {
        let Model = service.models[modelName];
        if (!Model || Model.hidden) {
          continue;
        }
        let model = {
          name: Model.name,
          id: Model.id,
          key: Model.key,
          label: Model.label,
          title: Model.title,
          sort: Model.sort,
          defaultSort: Model.defaultSort,
          defaultColumns: Model.defaultColumns,
          nocreate: Model.nocreate,
          noedit: Model.noedit,
          noremove: Model.noremove,
          groups: Model.groups,
          relationships: Model.relationships,
          actions: Model.actions || {},
          fields: {},
          searchFields: Model.searchFields || []
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
          let options = field.viewOptions();
          if (options.label == '_ID') {
            options.label = 'ID';
          }
          model.fields[path] = options;
        }
        if (!model.fields._id) {
          model.fields._id = {
            label: 'ID',
            path: '_id',
            cell: 'TextFieldCell'
          };
        }
        settings.models[Model.name] = model;
      }
      services[service.id] = settings;
    }

    let abilities = result.abilities = {};

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
          role = await Role.findCache(role);
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
        menu.push(item);
      }
      return res;
    }, {});

    _.each(menuMap, item => {
      if (item.parent && menuMap[item.parent]) {
        if (!menuMap[item.parent].subs) {
          menuMap[item.parent].subs = [];
        }
        item.isSub = true;
        menuMap[item.parent].subs.push(item);
      }
    });

    result.menu = _.filter(menu, item => !item.isSub);

    for (let serviceId in alaska.services) {
      let service = alaska.services[serviceId];
      if (service != this && service.settings) {
        await service.settings(user, result);
      }
    }

    return result;
  }
}
