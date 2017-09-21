/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var DateTimeTouch = require('../src/index');

var dtt = new DateTimeTouch();

dtt.on('change', function (dt) {
    console.log('change', dt);
});

document.getElementById('demo').onclick = function () {
    dtt.open();
};


