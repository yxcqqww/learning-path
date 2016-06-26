/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：selectDate(选择日期)
 3. 作者：(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
必需指定name属性。对日历指定name，那么同一name的日历只能选中一个日期。
*/
$.fn.dateShow = function() {
    var _t = $(this);
    var _container = _t.parent();
    var _tname = _t.attr("name");
    if (!_tname) {
        console.error("请为日历指定一个name");
        return;
    }
    _t.addClass("date");
    //获取当天日期
    var date = _t.attr("data-today");
    var month = _t.attr("month");
    //获取年份
    var startYear = month.split("-")[0];
    //获取月份
    var srartMon = month.split("-")[1];
    //获取今天日期 
    var today = date === undefined ? "" : date.split("-")[2];
    //获取当月总天数
    var totalDay = getDaysInMonth(startYear, srartMon);
    // 获取需要初始化的月份
    var strMonth = startYear + "-" + srartMon;

    // 获取可以选择的日期
    var arrDate = [];
    for (var i = 0; i <= totalDay; i++) {
        if (i > today) {
            arrDate.push(i);
        }
    };

    //获取当月第一个可用日期
    var firstDay = startYear + "-" + srartMon + "-" + (parseInt(today) + 1);
    // 获取当月的第一天是星期几。
    var monthPrefix = strMonth.substr(0, 4) + "-" + strMonth.substr(5);
    var firstDateStr = strMonth.substr(0, 4) + "-" + strMonth.substr(5) + "-01";
    var firstDate = new Date(firstDateStr);

    var week = firstDate.getDay() == 0 ? 0 : firstDate.getDay();

    // 创建日历结构
    var dateHtml = "";

    // 创建日历日期
    for (var j = 1; j <= totalDay;) {
        var weekIndex = 1;
        // 创建一个星期的日历行
        dateHtml += "<tr>";
        // 1号前面的空白日期，拼接空白的td
        if (j == 1) {
            for (var w = 1; w < week; w++) {
                weekIndex++;
                dateHtml += "<td><span></span></td>";
            }
        }
        for (; weekIndex <= 7; weekIndex++) {
            if (j <= totalDay) {
                dateHtml += "<td date='" + j + "' data-date='" + monthPrefix + "-" + j + "'> <span>" + j + "</span></td>";
            } else {
                dateHtml += "<td><span></span></td>";
            }
            j++;
        }
        // 结束一个星期的日历行
        dateHtml += "</tr>";
    }
    // 拼接日历到dom下
    _t.append(dateHtml);

    //判断当前是否需要显示
    date === undefined ? _t.addClass("hide") : date.split("-")[2];

    //绑定可预约日期的click事件
    for (var i = 0; i < arrDate.length; i++) {
        _t.find("[date='" + arrDate[i] + "']").addClass("able").on('click', function() {
            var _this = $(this);
            _container.find("td").removeClass('on');
            _container.find("td span").removeClass('active');

            _this.addClass('on');
            _this.find("span").addClass('active');
            $("#myDate").val(_this.attr("data-date"));
        });
    }

    //date-tool月份点击事件
    $(".date-tool").off('click').on('click', 'li.active', function() {
            var _this = $(this),
                year = parseInt($(".date-tool .year").text()),
                month = parseInt($(".date-tool .month").text());
            _this.removeClass("active").siblings(".tool").addClass("active");
            $(".table-condensed tbody.hide").removeClass("hide").siblings("tbody").addClass("hide");
            //加减月份或者年份
            if (_this.hasClass("next")) {
                if (month >= 12) {
                    $(".date-tool .month").text("1");
                    $(".date-tool .year").text(year + 1);
                } else {
                    $(".date-tool .month").text(month + 1);
                }
            } else {
                if (month <= 1) {
                    $(".date-tool .month").text("12");
                    $(".date-tool .year").text(year - 1);
                } else {
                    $(".date-tool .month").text(month - 1);
                }
            }
        })
        //给当月第一个可用日期可用
    if (_container.find("td.on").length == 0) {
        _t.find("[data-date='" + firstDay + "']").addClass('on').find('span').addClass('active');
    }

    var returnObj = {
        _date: _t,
        reset: function() {
            $(".date[name='" + _t.attr("name") + "'] td[date]").removeClass("selected");
            $("#" + _t.attr("name")).val("");
        }
    };
    return returnObj;
}

function getDaysInMonth(year, month) {
    var new_year = year; //取当前的年份        
    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）        
    if (month > 12) //如果当前大于12月，则年份转到下一年        
    {
        new_month -= 12; //月份减        
        new_year++; //年份增        
    }
    var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天        
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期       
}
