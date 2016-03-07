'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

exports.default = {
  statics: [{
    root: process.cwd() + '/runtime/alaska-admin-view/build',
    prefix: '/js'
  }, {
    root: (0, _path.join)(__dirname, '../../static'),
    prefix: '/static'
  }],
  templates: '../templates',
  services: [{ id: 'alaska-user', alias: 'user' }]
}; /**
    * @copyright Maichong Software Ltd. 2016 http://maichong.it
    * @date 2016-01-28
    * @author Liang <liang@maichong.it>
    */