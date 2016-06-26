/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：news(个人中心-专项检查预约)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function SepecialAppointment() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    tab切换
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapTabs();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击预约详情显示详情
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.showDetails();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击评价显示评价相关内容
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.showComments();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    确认评价
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.confirmComment();

    this.dropBookingHandler();

    this.delBookingHandler();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();
}
/*top栏获取一些东西*/
SepecialAppointment.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 点击预约详情显示详情
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
SepecialAppointment.prototype.showDetails = function() {
    var classSelf = this;

    $("dd.col-5 a").on("click", function() {
        var _this = $(this);
        var $markList = _this.parents("dl").siblings('.mark-list');
        var $optionsList = $markList.find(".mark-options-item ul");
        var $radioInputs = $markList.find("input:radio");
        if (!$markList.hasClass('hide')) {
            $markList.addClass('hide');
            $optionsList.addClass('hide');
            $optionsList.find("a[data-flag]").removeClass('active');
            $radioInputs.removeAttr('checked');
        }
        var bookingId = _this.parents(".item").eq(0).find("#bookingId").val();
        _this.parents(".item").eq(0).find(".booking-details").load("/personal/booking/step/" + bookingId, function() {
            $(this).removeClass("hide");

        });
    });

    $("body").on("click", ".booking-details .op", function() {
        var _this = $(this);
        var $detailsContainer = _this.parent();
        if (!$detailsContainer.hasClass('hide')) {
            $detailsContainer.addClass('hide');
        }
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 评论相关事件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
SepecialAppointment.prototype.showComments = function() {
    // 点击显示评论
    $(".btnShowMask").on("click", function() {
        var _this = $(this);
        var $detailsContainer = _this.parents("dl").siblings('.booking-details');
        var $maskList = _this.parents("dl").siblings('.mark-list');

        if ($maskList.hasClass('hide')) {
            $maskList.removeClass('hide');
        }

        if (!$detailsContainer.hasClass('hide')) {
            $detailsContainer.addClass('hide');
        }
    });

    // 点击取消评论
    $(".mark-list .cancel").on("click", function() {
        var $maskList = $(this).parents(".mark-list");
        var $optionsList = $maskList.find(".mark-options-item ul");
        var $radioInputs = $maskList.find("input:radio");


        $optionsList.addClass('hide');
        $optionsList.find("a[data-flag]").removeClass('active');
        $radioInputs.removeAttr('checked');
        $maskList.addClass('hide');
        $(".promo").show();
    });

    // 点击评论标签
    $("body").on("click", ".mark-list li[data-flag]", function() {
        var _this = $(this);

        // modified by liuchangkui 2016/02/16 start
        _this.hasClass("active") ? _this.removeClass('active') : _this.addClass('active');

        var $markList = $(this).parents(".mark-list").eq(0);
        if ($markList.find("li[data-flag].active").length > 0) {
            $markList.find("#btnComment").removeClass("disabled");
        } else if (!$markList.find("#btnComment").hasClass("disabled")) {
            $markList.find("#btnComment").addClass("disabled");
        }
        // modified by liuchangkui 2016/02/16 end
    });

    // 点击好评差评的radio
    $(".mark-list input:radio").on("click", function() {
        var _this = $(this);
        var $optionsList = _this.parent().siblings('.mark-options-item');
        var $optionsItems = $optionsList.find("li[data-flag]");
        var $toShowItems = $optionsList.find("li[data-flag='" + _this.data("for") + "']");


        $optionsList.find("ul").removeClass('hide');
        $optionsList.find("span").hide();
        $optionsItems.addClass('hide').removeClass('active');
        $toShowItems.removeClass('hide');

        // add by liuchangkui 2016/02/16 start
        var $markList = $(this).parents(".mark-list").eq(0);
        if ($markList.find("li[data-flag].active").length > 0) {
            $markList.find("#btnComment").removeClass("disabled");
        } else if (!$markList.find("#btnComment").hasClass("disabled")) {
            $markList.find("#btnComment").addClass("disabled");
        }
        // add by liuchangkui 2016/02/16 end
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 确认评价
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
SepecialAppointment.prototype.confirmComment = function() {
    var classSelf = this;

    $("body").on("click", "#btnComment", function() {
        var _btn = $(this);
        if (_btn.hasClass("disabled")) {
            return false;
        }

        _btn.attr("disabled", "disabled");
        var tagIds = "";
        var selectedTags = $(".mark-options-item li.active");
        selectedTags.each(function(i, item) {
            tagIds += $(item).attr("data-tagId");
            tagIds += ","
        });
        tagIds = tagIds == "" ? tagIds : tagIds.substring(0, tagIds.length - 1);
        var data = {
            tagIds: tagIds,
            bookingId: _btn.parents(".item").eq(0).find("#bookingId").val()
        };

        var param = {
            // 成功调用预约接口回掉
            process: function(data) {
                window.history.go(0);
            },
            onExceptionInterface: function(code, messgae) {
                _btn.removeAttr("disabled");
            }
        };
        classSelf.request("/personal/comment.do", data, param);
    });

};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 取消预约
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
SepecialAppointment.prototype.dropBookingHandler = function() {
    var _co = this;
    $("body").on("click", ".j-drop-booking", function() {
        /*  var $dropBtn = $(this);
        _co.confirm({
            'content': '您确认要取消预约吗？？',
            'confirmInterface': function() {
                var bookingId = $dropBtn.attr("data-id");
                var data = {
                    "id": bookingId
                };
                var param = {
                    process: function(data) {
                        window.history.go(0);
                    },
                    onExceptionInterface: function(code, messgae) {

                    }
                };
                _co.request("/personal/booking/drop.do", data, param);
            }
        });
*/
        $("#guanaihuiCancel").modal();
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 删除预约
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
SepecialAppointment.prototype.delBookingHandler = function() {
  var _co = this;
    $("body").on("click", ".j-del-booking", function() {
        var $dropBtn = $(this);
        _co.confirm({
            'content': '您确认要删除预约吗？？',
            'confirmInterface': function() {
                var bookingId = $dropBtn.attr("data-id");
                var data = {
                    "id": bookingId
                };
                var param = {
                    process: function(data) {
                        window.history.go(0);
                    },
                    onExceptionInterface: function(code, messgae) {

                    }
                };
                _co.request("/personal/booking/del.do", data, param);
            }
        });
    });
};


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new SepecialAppointment;
});
