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

  static groups = {
    test: '测试'
  };

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
      type: String,
      default: '',
      fullWidth: true
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
    subs: {
      label: '子菜单',
      type: ['AdminMenu'],
      depends: {
        type: 'group'
      },
      fullWidth: true
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
}
