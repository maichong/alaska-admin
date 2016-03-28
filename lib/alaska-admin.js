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

  /**
   * [async] 获取管理平台前台配置
   * @param {User} user
   * @returns {object}
   */
  settings(user) {
    var _this = this;

    return _asyncToGenerator(function* () {

      let alaska = _this.alaska;

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
        let Role = _this.model('user.Role');
        for (let role of user.roles) {
          if (typeof role == 'string') {
            role = yield Role.findCache(role);
          }
          if (role) {
            addAbilities(role.abilities);
          }
        }
      }

      let isSuperUser = user.id == _this.config(true, 'superUser');

      let AdminMenu = _this.model('AdminMenu');
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
        if (service != _this && service.settings) {
          yield service.settings(user, result);
        }
      }

      return result;
    })();
  }
}
exports.default = AdminService;