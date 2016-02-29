'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

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
        name: 'admin',
        desc: '登录管理平台'
      }];
      let roles = [{
        name: 'admin',
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
}
exports.default = AdminService;