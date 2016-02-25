/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

export default {
  statics: process.cwd() + '/runtime/alaska-admin-view/build',
  templates: '../templates',
  services: [
    { id: 'alaska-user', alias: 'user' }
  ]
};
