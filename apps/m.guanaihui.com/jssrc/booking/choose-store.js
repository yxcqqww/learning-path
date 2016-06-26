/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.guanaihui.com
 2. 页面名称：chooseStore(选择门店)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ChooseStoreController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    是否需要header
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     选择门店
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.storeSelected();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     确定选择
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitListener();
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ChooseStoreController.prototype.toggleHeader = function() {
    require([this.utilStaticPrefix + "/url/url.min.js"], function() {
        var urlParam = $.url('?');
        if (urlParam && 'header' in urlParam) {
            urlParam.header === 'true' ? $('header').show() : $('header').hide();
        }
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
选择日期
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ChooseStoreController.prototype.storeSelected = function() {
    var classSelf = this;
    $("dl").click(function() {
        var _this = $(this);
        _this.addClass("active").siblings("dl").removeClass("active");
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
确定选择
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ChooseStoreController.prototype.submitListener = function() {
    var classSelf = this;
    require([this.utilStaticPrefix + "/url/url.min.js"], function() {
        var urlParam = $.url('?');
        $(".fixed-toolbar a").click(function() {
            var _this = $(this),
                dataId = $("dl.active").attr("data-id"),
                myDate = "";
            if (urlParam && 'myDate' in urlParam) {
                myDate = urlParam.myDate;
            }
            window.location.href = "./index.html?storeId=" + dataId + "&myDate=" + myDate;
        });
    })

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ChooseStoreController;
});
