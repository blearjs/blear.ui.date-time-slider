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

var namespace = 'blearui-dateTimeTouch';
var defaults = {};
var DateTimeTouch = Popup.extend({
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        DateTimeTouch.parent(the);
        the[_initNode]();
        the[_initEvent]();
    }
});
var sole = DateTimeTouch.sole;
var _options = sole();
var _initNode = sole();
var _initEvent = sole();
var _yearDraggableList = sole();
var _monthDraggableList = sole();
var _dateDraggableList = sole();
var _hourDraggableList = sole();
var _minuteDraggableList = sole();
var _secondDraggableList = sole();
var proto = DateTimeTouch.prototype;

proto[_initNode] = function () {
    var the = this;
    var popupEl = the.getPopupEl();
    // var queryEl = function (className) {
    //       return selector.query(className, popupEl)[0];
    // };

    popupEl.innerHTML = require('./template.html');
    var nodeList = selector.query('.' + namespace + '-item', popupEl);
    var dt = new Date();
    var year = dt.getFullYear();

    the[_yearDraggableList] = new DraggableList({
        el: nodeList[0],
        list: wrapList(array.range(year, year + 1), '年')
    });
    the[_monthDraggableList] = new DraggableList({
        el: nodeList[1],
        list: wrapList(array.range(1, 12), '月', -1)
    });
    the[_dateDraggableList] = new DraggableList({
        el: nodeList[2],
        list: wrapList(array.range(1, 31), '日')
    });
    the[_hourDraggableList] = new DraggableList({
        el: nodeList[3],
        list: wrapList(array.range(0, 23), '时')
    });
    the[_minuteDraggableList] = new DraggableList({
        el: nodeList[4],
        list: wrapList(array.range(0, 59), '分')
    });
    the[_secondDraggableList] = new DraggableList({
        el: nodeList[5],
        list: wrapList(array.range(0, 59), '秒')
    });
};

proto[_initEvent] = function () {
    var the = this;
    var getValue = function (instance) {
        return instance.getActive().value;
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

        for(start = 0; start < hideDayLen; start++) {
            var hideIndex = maxDays - start - 1;
            the[_dateDraggableList].setVisible(hideIndex, false);
        }

        for(start = 0; start < showDayLen; start++) {
            var showIndex = minDays + start;
            the[_dateDraggableList].setVisible(showIndex, true);
        }
    };

    the[_yearDraggableList].on('change', function (item) {
        changeDate();
    });

    the[_monthDraggableList].on('change', function (item) {
        changeDate();
    });

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
DateTimeTouch.defaults = defaults;
module.exports = DateTimeTouch;

function wrapList(list, unit, plus) {
    plus = plus || 0;
    return array.map(list, function (item) {
        return {
            text: item + unit,
            value: item + plus
        };
    });
}
