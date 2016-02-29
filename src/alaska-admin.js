/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default class AdminService extends alaska.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-admin';
    options.dir = __dirname;
    super(options, alaska);
  }

  async postLoadModels() {
    let userService = this.service('user');

    let abilities = [{
      name: 'admin',
      desc: '登录管理平台'
    }];
    let roles = [{
      name: 'admin',
      desc: '管理员',
      abilities: ['admin']
    }];

    for (let ability of abilities) {
      ability.service = this.id;
      await userService.registerAbility(ability);
    }
    for (let role of roles) {
      role.service = this.id;
      await userService.registerRole(role);
    }
  }
}
