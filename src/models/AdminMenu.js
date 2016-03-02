/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-01
 * @author Liang <liang@maichong.it>
 */

const service = __service;

export default class AdminMenu extends service.Model {
  static fields = {
    label: {
      label: '标题',
      type: String,
      require: true
    },
    icon: {
      label: '图标',
      type: String,
      default: ''
    },
    type: {
      label: '类型',
      type: String,
      default: 'link'
    },
    ability: {
      label: '权限',
      type: String,
      default: ''
    },
    link: {
      label: '链接',
      type: String,
      default: '',
      depends: {
        type: 'link'
      }
    },
    subs: {
      label: '子菜单',
      type: ['AdminMenu'],
      depends: {
        type: 'group'
      }
    }
  };
}
