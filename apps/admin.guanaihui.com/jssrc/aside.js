/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：aside(侧边栏)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Aside() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.init();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    为元素绑定事件
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind();
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Aside.prototype.init = function() {
    var classSelf = this;
    this.switchAsideStatus($(".aside").attr("data-status"));
    $(".aside section").each(function() {
        classSelf.switchChildStatus(this, $(this).attr("data-status"));
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
为元素绑定事件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Aside.prototype.bind = function() {
    var classSelf = this;
    $(".aside section").each(function() {
        var section = this;
        $(this).find(".parent").unbind("click").bind("click", function() {
            var status = $(section).attr("data-status").toLowerCase();
            status = (status === "open") ? "close" : "open";
            classSelf.switchChildStatus(section, status);
        });
    });

    $(".header .switcher").unbind('click').bind('click', function() {
        var status = $(".aside").attr("data-status").toLowerCase();
        status = (status === "open") ? "close" : "open";
        classSelf.switchAsideStatus(status);
    });

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
切换子菜单显示状态
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Aside.prototype.switchChildStatus = function(section, status) {
    var status = status.toLowerCase();
    if (status === "open") {
        $(section).find(".parent .handle i").removeClass("triangle-down").addClass("triangle-up");
        $(section).find(".child").show(200);
    } else if (status === "close") {
        $(section).find(".parent .handle i").removeClass("triangle-up").addClass("triangle-down");
        $(section).find(".child").hide(200);
    }
    $(section).attr("data-status", status);
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
切换侧边栏显示状态
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Aside.prototype.switchAsideStatus = function(status) {
    var status = status.toLowerCase();
    if (status === "open") {
        $(".header dt, .aside").animate({
            width: "230px"
        }, 200);
        $(".content-wrapper").animate({
            marginLeft: "230px"
        }, 200);
        $(".header .switcher .iconfont").removeClass("icon-liebiao1").addClass("icon-xifen");
        $(".header dt span, .aside .account, .aside .handle, .description").show();
    } else if (status === "close") {
        $(".header dt, .aside").animate({
            width: "50px"
        }, 200);
        $(".content-wrapper").animate({
            marginLeft: "50px"
        }, 200);
        $(".header .switcher .iconfont").addClass("icon-liebiao1").removeClass("icon-xifen");
        $(".header dt span, .aside .account, .aside .handle, .description").hide();
    }
    $(".aside").attr("data-status", status);
};