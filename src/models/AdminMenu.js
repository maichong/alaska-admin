/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-01
 * @author Liang <liang@maichong.it>
 */

export default class AdminMenu extends service.Model {

  static label = 'Admin Menu';
  static title = 'label';
  static defaultColumns = 'icon label type sort service link ability activated';
  static defaultSort = '-sort';
  static searchFields = 'label link parent';

  static fields = {
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
      ref: 'AdminMenu',
      filters: {
        type: 'group'
      }
    },
    service: {
      label: 'Service',
      type: String
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

  async preSave() {
    if (this.parent && this.parent == this._id) {
      throw new Error('Parent can not be self');
    }
  }
}
