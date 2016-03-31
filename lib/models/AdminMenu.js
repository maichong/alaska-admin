'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-01
 * @author Liang <liang@maichong.it>
 */

class AdminMenu extends service.Model {

  preSave() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.parent && _this.parent == _this._id) {
        throw new Error('父菜单不能为自己');
      }
    })();
  }
}
exports.default = AdminMenu;
AdminMenu.label = 'Admin Menu';
AdminMenu.title = 'label';
AdminMenu.defaultColumns = 'icon,label,type,sort,link,ability,activated';
AdminMenu.defaultSort = '-sort';
AdminMenu.searchFields = 'label,link,parent';
AdminMenu.noremove = true;
AdminMenu.fields = {
  _id: String,
  label: {
    label: 'Title',
    type: String,
    required: true
  },
  icon: {
    label: 'Icon',
    type: String,
    default: ''
  },
  type: {
    label: 'Type',
    type: 'select',
    default: 'link',
    options: [{
      label: '链接',
      value: 'link'
    }, {
      label: '组',
      value: 'group'
    }]
  },
  ability: {
    label: 'Ability',
    type: ['user.Ability']
  },
  link: {
    label: 'Link',
    type: String,
    default: '',
    depends: {
      type: 'link'
    },
    fullWidth: true
  },
  parent: {
    label: 'Parent Menu',
    type: 'relationship',
    ref: 'AdminMenu'
  },
  sort: {
    label: 'Sort',
    type: Number,
    default: 0
  },
  activated: {
    label: 'Activated',
    type: Boolean
  }
};