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
      desc: '登录管理平台'
    }];
    let roles = [{
      id: 'admin',
      desc: '管理员',
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
          sort: Model.sort,
          defaultSort: Model.defaultSort,
          groups: Model.groups,
          fields: {}
        };
        for (let path in Model.fields) {
          let field = Model.fields[path];
          if (field.type.viewOptions) {
            model.fields[path] = field.type.viewOptions(field, Model);
          } else {
            model.fields[path] = alaska.Field.viewOptions.call(field.type, field, Model);
          }
        }
        settings.models[Model.name] = model;
      }
      services[service.id] = settings;
    }

    return {
      services
    };
  }
}
