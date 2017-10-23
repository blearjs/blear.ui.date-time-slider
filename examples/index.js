/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var DateTimeTouch = require('../src/index');


var dtt = new DateTimeTouch({
    initDate: new Date(2018, 3, 11, 12, 34, 56)
});

window.dtt = dtt;
console.log('初始化', dtt.getDate());

dtt.on('change', function (dt) {
    console.log('change', dt);
});

document.getElementById('demo').onclick = function () {
    dtt.open();
};


