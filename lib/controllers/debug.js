/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-25
 * @author Liang <liang@maichong.it>
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
function index(ctx) {
  ctx.body = '<h1>admin home page</h1> <br/> <pre>' + JSON.stringify(ctx.toJSON(), null, ' ') + '</pre>';
}