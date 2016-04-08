/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import { join } from 'path';

export default {
  prefix: '/admin',
  statics: [{
    root: process.cwd() + '/runtime/alaska-admin-view/build',
    prefix: '/static/js'
  }, {
    root: join(__dirname, '../../static/img'),
    prefix: '/static/img'
  }],
  templates: '../templates',
  services: [
    { id: 'alaska-user', alias: 'user' }
  ],
  /**
   * run Init sled when every launch
   */
  autoInit: true
};
