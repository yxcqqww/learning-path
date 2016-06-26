/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.guanaihui.com
 2. 页面名称：Native Hybrid 礼品卡绑定
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function WomenDaysActivityController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     初始化native 跳转Url
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initNativeRedirectUrl();
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化native 跳转Url
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
WomenDaysActivityController.prototype.initNativeRedirectUrl = function() {
    var classSelf = this;
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        function setupWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                return callback(WebViewJavascriptBridge);
            }
            if (window.WVJBCallbacks) {
                return window.WVJBCallbacks.push(callback);
            }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function() {
                document.documentElement.removeChild(WVJBIframe)
            }, 0)
        }

        setupWebViewJavascriptBridge(function(bridge) {
            $(".product-list .item .btn-booking").on("click", function(e) {
                var _this = $(this);
                var type = _this.attr("data-type");
                var requestUrl = classSelf.nativeRedirectUrl + type;
                var requestData = {};

                if (type === "companyDetail") {
                    requestData.companyId = _this.attr("data-companyid");
                    requestData.companyName = _this.attr("data-companyName");
                    requestData.shopId = _this.attr("data-shopid");
                    requestData.shopName = _this.attr("data-shopname");
                    requestData.origin = _this.attr("data-origin");
                } else if (type === "productDetail") {
                    requestData.companyId = _this.attr("data-companyid");
                    requestData.companyName = _this.attr("data-companyName");
                    requestData.shopId = _this.attr("data-shopid");
                    requestData.shopName = _this.attr("data-shopname");
                    requestData.productId = _this.attr("data-productid");
                    requestData.productName = _this.attr("data-productname");
                    requestData.origin = _this.attr("data-origin");
                }

                bridge.callHandler(requestUrl, JSON.stringify(requestData), function(response) {
                    log('JS got response', response)
                })

                e.preventDefault();
            });
        })
    } else if (userAgent.match(/Android/i)) {
        $(".product-list .item .btn-booking").each(function(index, el) {
            var redirectUrl = "";
            var type = $(el).attr("data-type");

            if (type === "companyDetail") {
                redirectUrl = classSelf.nativeRedirectUrl + type + "?companyId=" + $(el).attr("data-companyid") + "&companyname=" + $(el).attr("data-companyname") + "&shopid=" + $(el).attr("data-shopid") + "&shopName=" + $(el).attr("data-shopname") + "&origin=" + $(el).attr("data-origin");
            } else if (type === "productDetail") {
                redirectUrl = classSelf.nativeRedirectUrl + type + "?companyId=" + $(el).attr("data-companyid") + "&companyname=" + $(el).attr("data-companyname") + "&shopid=" + $(el).attr("data-shopid") + "&shopName=" + $(el).attr("data-shopname") + "&productId=" + $(el).attr("data-productid") + "&productName=" + $(el).attr("data-productname") + "&origin=" + $(el).attr("data-origin");
            }

            $(el).attr("href", redirectUrl);
            $(el).next("span").html(redirectUrl);

        });

    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new WomenDaysActivityController;
});
