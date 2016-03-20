/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-01
 * @author Liang <liang@maichong.it>
 */

const service = __service;

export default class AdminMenu extends service.Model {

  static label = '管理菜单';
  static title = 'label';
  static defaultColumns = 'icon,label,type,sort,link,ability,activated';
  static searchFields = 'label,link,parent';
  static noremove = true;

  static fields = {
    _id: String,
    label: {
      label: '标题',
      type: String,
      required: true
    },
    icon: {
      label: '图标',
      type: String,
      default: ''
    },
    type: {
      label: '类型',
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
      label: '权限',
      type: ['user.Ability']
    },
    link: {
      label: '链接',
      type: String,
      default: '',
      depends: {
        type: 'link'
      },
      fullWidth: true
    },
    parent: {
      label: '父菜单',
      type: 'relationship',
      ref: 'AdminMenu'
    },
    sort: {
      label: '排序',
      type: Number,
      default: 0
    },
    activated: {
      label: '激活',
      type: Boolean
    }
  };

  async preSave() {
    if (this.parent && this.parent == this._id) {
      throw new Error('父菜单不能为自己');
    }
  }
}
