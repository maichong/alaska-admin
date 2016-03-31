'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _RegisterMenu = require('./RegisterMenu');

var _RegisterMenu2 = _interopRequireDefault(_RegisterMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-03-28
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

/**
 * 自动已经系统中所有的模型,注册管理员后台菜单
 */
class Init extends service.Sled {
  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.service;
      const alaska = service.alaska;
      const USER = service.service('user');
      const AdminMenu = service.model('AdminMenu');

      USER.run('RegisterAbility', {
        id: 'admin',
        title: 'Admin login',
        service: 'alaska-admin'
      });
      yield USER.run('RegisterRole', {
        id: 'admin',
        title: 'Admin',
        abilities: ['admin']
      });
      const root = yield USER.run('RegisterRole', {
        id: 'root',
        title: 'Root',
        abilities: ['admin']
      });
      let menus = _lodash2.default.reduce((yield AdminMenu.find()), function (res, menu) {
        res[menu._id] = menu;
        return res;
      }, {});

      for (let serviceId in alaska.services) {
        let ser = alaska.services[serviceId];
        for (let modelName in ser.models) {
          let Model = ser.models[modelName];
          let ability = `admin.${ Model.key }.`.toLowerCase();
          ['read', 'create', 'remove', 'update'].forEach(function (action) {
            let id = ability + action;
            USER.run('RegisterAbility', {
              id,
              title: `${ action } ${ Model.name }`,
              service: 'alaska-admin'
            });
            if (root.abilities.indexOf(id) < 0) {
              root.abilities.push(id);
            }
          });
          if (Model.hidden) {
            continue;
          }
          let id = `model.${ Model.key }`.toLowerCase();
          if (menus[id]) {
            continue;
          }
          _RegisterMenu2.default.run({
            id,
            label: Model.label,
            type: 'link',
            link: `/list/${ ser.id }/${ Model.name }`,
            ability: [ability + 'read'],
            activated: true
          });
        }
      }
      root.save();
    })();
  }
}
exports.default = Init;