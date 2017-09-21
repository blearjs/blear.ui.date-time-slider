/**
 * blear.ui.date-time-touch
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Popup = require('blear.ui.popup');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var date = require('blear.utils.date');
var DraggableList = require('blear.ui.draggable-list');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');

var namespace = 'blearui-dateTimeTouch';
var defaults = {
    year: true,
    month: true,
    date: true,
    hour: true,
    minute: true,
    second: true
};
var DateTimeToucher = Popup.extend({
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        DateTimeToucher.parent(the);
        the[_initNode]();
        the[_initEvent]();
    }
});
var sole = DateTimeToucher.sole;
var _options = sole();
var _initNode = sole();
var _initEvent = sole();
var _yearDraggableList = sole();
var _monthDraggableList = sole();
var _dateDraggableList = sole();
var _hourDraggableList = sole();
var _minuteDraggableList = sole();
var _secondDraggableList = sole();
var proto = DateTimeToucher.prototype;

proto[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var popupEl = the.getPopupEl();
    // var queryEl = function (className) {
    //       return selector.query(className, popupEl)[0];
    // };

    popupEl.innerHTML = require('./template.html');
    var nodeList = selector.query('.' + namespace + '-item', popupEl);
    var dt = new Date();
    var year = dt.getFullYear();
    var hide = function (index) {
        attribute.hide(nodeList[index]);
    };

    if (options.year) {
        the[_yearDraggableList] = new DraggableList({
            el: nodeList[0],
            list: wrapList(array.range(year, year + 1), '年')
        });
    } else {
        hide(0);
    }

    if (options.month) {
        the[_monthDraggableList] = new DraggableList({
            el: nodeList[1],
            list: wrapList(array.range(1, 12), '月', -1)
        });
    }else {
        hide(1);
    }

    if (options.date) {
        the[_dateDraggableList] = new DraggableList({
            el: nodeList[2],
            list: wrapList(array.range(1, 31), '日')
        });
    }else {
        hide(2);
    }

    if (options.hour) {
        the[_hourDraggableList] = new DraggableList({
            el: nodeList[3],
            list: wrapList(array.range(0, 23), '时')
        });
    }else {
        hide(3);
    }

    if (options.minute) {
        the[_minuteDraggableList] = new DraggableList({
            el: nodeList[4],
            list: wrapList(array.range(0, 59), '分')
        });
    }else {
        hide(4);
    }

    if (options.second) {
        the[_secondDraggableList] = new DraggableList({
            el: nodeList[5],
            list: wrapList(array.range(0, 59), '秒')
        });
    }else {
        hide(5);
    }
};

proto[_initEvent] = function () {
    var the = this;
    var getValue = function (instance) {
        return instance ? instance.getActive().value : 0;
    };
    var changeDate = function () {
        var year = getValue(the[_yearDraggableList]);
        var month = getValue(the[_monthDraggableList]);
        var days = date.getDaysInMonth(year, month);
        var maxDays = 31;
        var minDays = 28;
        // 29/30/31
        var maxHideDayLen = 3;
        var hideDayLen = maxDays - days;
        var showDayLen = maxHideDayLen - hideDayLen;
        var start = 0;

        for (start = 0; start < hideDayLen; start++) {
            var hideIndex = maxDays - start - 1;
            the[_dateDraggableList].setVisible(hideIndex, false);
        }

        for (start = 0; start < showDayLen; start++) {
            var showIndex = minDays + start;
            the[_dateDraggableList].setVisible(showIndex, true);
        }
    };

    if (the[_yearDraggableList]) {
        the[_yearDraggableList].on('change', function (item) {
            changeDate();
        });
    }

    if (the[_monthDraggableList]) {
        the[_monthDraggableList].on('change', function (item) {
            changeDate();
        });
    }

    the.on('close', function () {
        var year = getValue(the[_yearDraggableList]);
        var month = getValue(the[_monthDraggableList]);
        var date = getValue(the[_dateDraggableList]);
        var hour = getValue(the[_hourDraggableList]);
        var minute = getValue(the[_minuteDraggableList]);
        var second = getValue(the[_secondDraggableList]);

        the.emit('change', new Date(year, month, date, hour, minute, second, 0));
    });
};

require('./style.css', 'css|style');
DateTimeToucher.defaults = defaults;
module.exports = DateTimeToucher;

function wrapList(list, unit, plus) {
    plus = plus || 0;
    return array.map(list, function (item) {
        return {
            text: item + unit,
            value: item + plus
        };
    });
}
