/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：order/details(订单->安排档期)
 3. 作者：俞晓晨(yuxiaochen@360guanai.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ArrangeController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     初始化日历控件
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initDatePicker();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     绑定事件
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind();
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化日历控件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ArrangeController.prototype.initDatePicker = function() {

    $("#txtBeginDate").datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd hh:00',
        minView: 1,
        startDate: new Date(),
        endDate: '+60d'
    }).on("changeDate", function(ev) {
        var _this = $(this);

        var year = _this.val().substring(0, 4);
        var month = _this.val().substring(5, 7);
        var day = _this.val().substring(8, 10);
        var hour = parseInt(_this.val().substring(11, 13));
        var hoursArray = new Array();


        $("#txtEndDate").val(year + "-" + month + "-" + day + " " + (hour + 1) + ":00");

        for (var i = 0; i <= hour; i++) {
            hoursArray.push(i)
        }

        $("#txtEndDate").datetimepicker("setHoursDisabled", hoursArray);

        if (parseInt(month) > 0) {
            month = parseInt(month) - 1;
        }

        $("#txtEndDate").datetimepicker("setStartDate", new Date(year, month, day, 0, 0, 0));
        $("#txtEndDate").datetimepicker("setEndDate", new Date(year, month, day, 23, 0, 0));
    });

    $("#txtEndDate").datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd hh:00',
        minView: 1,
        startView: 1
    }).on("show", function(ev) {
        if ($("#txtBeginDate").val() == "") {
            $(this).datetimepicker('hide');
        } else {

        }
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
绑定事件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ArrangeController.prototype.bind = function() {
    var classSelf = this;

    $(".op .save").on("click", function() {
        var startDate = $("#txtBeginDate").val();
        var endDate = $("#txtEndDate").val();

        if (startDate.length === 0 || endDate.length === 0) {
            classSelf.tips("<span class='text-danger'>请选择预约时间</span>", 3);

            return false;
        } else {
            var confirmContent = "<div style='margin-left:10px;font-size:14px;'>请核实以下更改信息：<br/>"
            confirmContent += "<p class='text-primary'>预约时间(意向):" + $("#lblOriginBookingDate").html() + "</p>"
            confirmContent += "<p class='text-primary'>预约时间(最终):" + startDate + "--" + endDate + "</p>"
            confirmContent += "<p class='text-danger'>*时间确定后不可修改，并且订单状态会流转至「待评价」状态。</p>"
            confirmContent += "</div>";

            classSelf.confirm({
                title: "档期安排确认",
                content: confirmContent,
                confirmInterface: function() {
                    $("#detailsForm").submit();
                }
            });
        }
    });
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ArrangeController;
});
