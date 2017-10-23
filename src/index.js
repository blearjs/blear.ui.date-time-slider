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
    second: true,
    minDate: null,
    maxDate: null,
    initDate: null
};
var DateTimeToucher = Popup.extend({
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        DateTimeToucher.parent(the);
        the[_initData]();
        the[_initNode]();
        the[_initEvent]();
    },

    /**
     * 设置日期时间
     * @param dt
     * @returns {DateTimeToucher}
     */
    setDate: function (dt) {
        var the = this;

        return the;
    },

    /**
     * 获取激活的日期
     * @returns {Date}
     */
    getDate: function () {
        var the = this;
        var year = getValue(the[_yearDraggableList]);
        var month = getValue(the[_monthDraggableList]);
        var date = getValue(the[_dateDraggableList]);
        var hour = getValue(the[_hourDraggableList]);
        var minute = getValue(the[_minuteDraggableList]);
        var second = getValue(the[_secondDraggableList]);

        return new Date(year, month, date, hour, minute, second, 0);
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        if (the[_yearDraggableList]) {
            the[_yearDraggableList].destroy();
        }

        if (the[_monthDraggableList]) {
            the[_monthDraggableList].destroy();
        }

        if (the[_dateDraggableList]) {
            the[_dateDraggableList].destroy();
        }

        if (the[_hourDraggableList]) {
            the[_hourDraggableList].destroy();
        }

        if (the[_minuteDraggableList]) {
            the[_minuteDraggableList].destroy();
        }

        if (the[_secondDraggableList]) {
            the[_secondDraggableList].destroy();
        }

        DateTimeToucher.invoke('destroy', the);
    }
});
var sole = DateTimeToucher.sole;
var _options = sole();
var _initData = sole();
var _minDate = sole();
var _maxDate = sole();
var _initDate = sole();
var _initNode = sole();
var _initEvent = sole();
var _yearDraggableList = sole();
var _monthDraggableList = sole();
var _dateDraggableList = sole();
var _hourDraggableList = sole();
var _minuteDraggableList = sole();
var _secondDraggableList = sole();
var proto = DateTimeToucher.prototype;

proto[_initData] = function () {
    var the = this;
    var options = the[_options];
    var minDate = options.minDate;
    var maxDate = options.maxDate;
    var initDate = options.initDate;
    var dt1 = new Date();
    var dt2 = new Date();

    dt1.setFullYear(dt1.getFullYear() + 2);
    the[_minDate] = minDate ? date.parse(minDate) : new Date();
    the[_maxDate] = maxDate ? date.parse(maxDate) : dt1;
    the[_initDate] = initDate ? date.parse(initDate) : dt2;
};

proto[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var popupEl = the.getPopupEl();

    popupEl.innerHTML = require('./template.html');
    var nodeList = selector.query('.' + namespace + '-item', popupEl);
    var hide = function (index) {
        attribute.hide(nodeList[index]);
    };

    if (options.year) {
        var minYear = the[_minDate].getFullYear();
        var maxYear = the[_maxDate].getFullYear();
        var yearList = wrapList(array.range(minYear, maxYear), '年');

        the[_yearDraggableList] = new DraggableList({
            el: nodeList[0],
            list: yearList,
            active: findIndex(yearList, the[_initDate].getFullYear())
        });
    } else {
        hide(0);
    }

    if (options.month) {
        var monthList = wrapList(array.range(1, 12), '月', -1);
        the[_monthDraggableList] = new DraggableList({
            el: nodeList[1],
            list: monthList,
            active: findIndex(monthList, the[_initDate].getMonth())
        });
    } else {
        hide(1);
    }

    if (options.date) {
        var dateList = wrapList(array.range(1, 31), '日');
        the[_dateDraggableList] = new DraggableList({
            el: nodeList[2],
            list: dateList,
            active: findIndex(dateList, the[_initDate].getDate())
        });
    } else {
        hide(2);
    }

    if (options.hour) {
        var hourList = wrapList(array.range(0, 23), '时');
        the[_hourDraggableList] = new DraggableList({
            el: nodeList[3],
            list: hourList,
            active: findIndex(hourList, the[_initDate].getHours())
        });
    } else {
        hide(3);
    }

    if (options.minute) {
        var minuteList = wrapList(array.range(0, 59), '分');
        the[_minuteDraggableList] = new DraggableList({
            el: nodeList[4],
            list: minuteList,
            active: findIndex(minuteList, the[_initDate].getMinutes())
        });
    } else {
        hide(4);
    }

    if (options.second) {
        var secondList = wrapList(array.range(0, 59), '秒');
        the[_secondDraggableList] = new DraggableList({
            el: nodeList[5],
            list: secondList,
            active: findIndex(secondList, the[_initDate].getSeconds())
        });
    } else {
        hide(5);
    }
};

proto[_initEvent] = function () {
    var the = this;
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
        the.emit('change', the.getDate());
    });
};

require('./style.css', 'css|style');
DateTimeToucher.defaults = defaults;
module.exports = DateTimeToucher;

/**
 * 获取 draggableList 实例的值
 * @param [instance]
 * @returns {number}
 */
function getValue(instance) {
    return instance ? instance.getActive().value : 0;
}

/**
 * 包装 list
 * @param list
 * @param unit
 * @param plus
 */
function wrapList(list, unit, plus) {
    plus = plus || 0;
    return array.map(list, function (item) {
        return {
            text: item + unit,
            value: item + plus
        };
    });
}

/**
 * 找到匹配的索引值
 * @param list
 * @param match
 * @returns {number}
 */
function findIndex(list, match) {
    var foundIndex = -1;
    array.each(list, function (index, item) {
        if (item.value === match) {
            foundIndex = index;
            return false;
        }
    });
    return foundIndex;
}
