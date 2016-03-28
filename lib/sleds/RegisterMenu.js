/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * 注册管理员后台菜单
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RegisterMenu extends __service.Sled {

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.service;
      const AdminMenu = service.model('AdminMenu');

      const id = _this.data.id || _this.data._id;

      let record = yield AdminMenu.findCache(id);
      if (record) {
        return record;
      }

      record = new AdminMenu(_this.data);
      record._id = id;
      yield record.save();

      return record;
    })();
  }
}
exports.default = RegisterMenu;