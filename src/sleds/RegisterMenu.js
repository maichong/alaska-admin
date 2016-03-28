/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * 注册管理员后台菜单
 */
export default class RegisterMenu extends __service.Sled {

  async exec() {
    const service = this.service;
    const AdminMenu = service.model('AdminMenu');

    const id = this.data.id || this.data._id;

    let record = await AdminMenu.findCache(id);
    if (record) {
      return record;
    }

    record = new AdminMenu(this.data);
    record._id = id;
    await record.save();

    return record;
  }
}
