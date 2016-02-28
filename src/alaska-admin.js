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
}
