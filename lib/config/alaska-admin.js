'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

exports.default = {
  prefix: '/admin',
  statics: [{
    root: process.cwd() + '/runtime/alaska-admin-view/build',
    prefix: '/static/js'
  }, {
    root: (0, _path.join)(__dirname, '../../static/img'),
    prefix: '/static/img'
  }],
  templates: '../templates',
  services: [{ id: 'alaska-user', alias: 'user' }],
  /**
   * run Init sled when every launch
   */
  autoInit: true
}; /**
    * @copyright Maichong Software Ltd. 2016 http://maichong.it
    * @date 2016-01-28
    * @author Liang <liang@maichong.it>
    */