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

/**
 * @class AdminService
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
        title: '登录管理平台'
      }];
      let roles = [{
        id: 'admin',
        title: '管理员',
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

  preRoute() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      //配置管理员菜单
      let alaska = _this2.alaska;
      let userService = _this2.service('user');
      let AdminMenu = _this2.model('AdminMenu');
      let menus = _.reduce((yield AdminMenu.find()), function (res, menu) {
        res[menu._id] = menu;
        return res;
      }, {});

      for (let serviceId in alaska.services) {
        let service = alaska.services[serviceId];
        for (let modelName in service.models) {
          let Model = service.models[modelName];
          let ability = `admin.${ Model.key }.`.toLowerCase();
          ['read', 'create', 'remove', 'update'].forEach(function (action) {
            userService.registerAbility({
              id: ability + action,
              title: `${ action } ${ Model.name }`,
              service: 'alaska-admin'
            });
          });
          if (Model.hidden) {
            continue;
          }
          let id = `model.${ Model.key }`.toLowerCase();
          if (menus[id]) {
            continue;
          }
          new AdminMenu({
            _id: id,
            label: Model.label,
            type: 'link',
            link: `/list/${ service.id }/${ Model.name }`,
            ability: [ability + 'read'],
            activated: true
          }).save();
        }
      }
    })();
  }

  /**
   * [async] 获取管理平台前台配置
   * @param {User} user
   * @returns {object}
   */
  settings(user) {
    var _this3 = this;

    return _asyncToGenerator(function* () {

      let alaska = _this3.alaska;

      let result = {};

      let services = result.services = {};

      for (let serviceId in alaska.services) {
        let service = alaska.services[serviceId];
        let settings = {};
        settings.id = serviceId;
        settings.domain = service.config('domain');
        settings.prefix = service.config('prefix');
        settings.api = service.config('api');
        settings.models = {};
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
        let Role = _this3.model('user.Role');
        for (let role of user.roles) {
          if (typeof role == 'string') {
            role = yield Role.findCache(role);
          }
          if (role) {
            addAbilities(role.abilities);
          }
        }
      }

      let isSuperUser = user.id == _this3.config(true, 'superUser');

      let AdminMenu = _this3.model('AdminMenu');
      let menu = [];
      let menuMap = _.reduce((yield AdminMenu.find({ activated: true }).sort('-sort')), function (res, item) {
        item = item.data();
        if (!item.ability || abilities[item.ability] || isSuperUser) {
          delete item.ability;
          res[item.id] = item;
          menu.push(item);
        }
        return res;
      }, {});

      _.each(menuMap, function (item) {
        if (item.parent && menuMap[item.parent]) {
          if (!menuMap[item.parent].subs) {
            menuMap[item.parent].subs = [];
          }
          item.isSub = true;
          menuMap[item.parent].subs.push(item);
        }
      });

      result.menu = _.filter(menu, function (item) {
        return !item.isSub;
      });

      for (let serviceId in alaska.services) {
        let service = alaska.services[serviceId];
        if (service != _this3 && service.settings) {
          yield service.settings(user, result);
        }
      }

      return result;
    })();
  }

  /**
   * [async] 注册管理员后台菜单
   * @param {object} data
   * @returns {AdminMenu}
   */
  registerMenu(data) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let AdminMenu = _this4.model('AdminMenu');
      let record = AdminMenu.findCache(data.id);
      if (record) {
        return record;
      }

      record = new AdminMenu(data);

      record._id = data.id;

      yield record.save();

      return record;
    })();
  }
}
exports.default = AdminService;