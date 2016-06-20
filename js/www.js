/**
 * 网站入口。以页面上html标签的module属性来做页面JS分隔。
 *
 * @author    Yao <yaogaoyu@qq.com>
 * @copyright © 2016 YaoYao
 * @license   GPL-3.0
 * @file      www.js
 */

var moduleName = $("html").attr("module");
var module;
switch(moduleName) {
    case "login":
        module = require("./lib/_login");
        break;
    default:
        break;
}
if (module) {
    module.perform();
}
