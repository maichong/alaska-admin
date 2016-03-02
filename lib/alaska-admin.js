'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-01-28
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

class AdminService extends _alaska2.default.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-admin';
    options.dir = __dirname;
    super(options, alaska);
  }

  postLoadModels() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let userService = _this.service('user');

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
        ability.service = _this.id;
        yield userService.registerAbility(ability);
      }
      for (let role of roles) {
        role.service = _this.id;
        yield userService.registerRole(role);
      }
    })();
  }

  /**
   * 获取管理平台前台配置
   * @param user
   * @returns {{}}
   */
  getSettings(user) {
    var _this2 = this;

    return _asyncToGenerator(function* () {

      let alaska = _this2.alaska;

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
    })();
  }
}
exports.default = AdminService;