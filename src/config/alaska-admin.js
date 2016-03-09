/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import {join} from 'path';

export default {
  prefix: '/admin',
  statics: [{
    root: process.cwd() + '/runtime/alaska-admin-view/build',
    prefix: '/js'
  }, {
    root: join(__dirname, '../../static'),
    prefix: '/static'
  }],
  templates: '../templates',
  services: [
    { id: 'alaska-user', alias: 'user' }
  ]
};
