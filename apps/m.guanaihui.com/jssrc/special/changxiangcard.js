/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.guanaihui.com
 2. 页面名称：changxiangka.html (畅享卡)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ChangxiangkaController() {
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
ChangxiangkaController.prototype.initNativeRedirectUrl = function() {
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
            $(".nativelink").on("click", function(e) {
                var _this = $(this);
                var type = _this.attr("data-type");
                var requestUrl = classSelf.nativeRedirectUrl + type;
                var requestData = {};

                bridge.callHandler(requestUrl, JSON.stringify(requestData), function(response) {
                    log('JS got response', response)
                })

                e.preventDefault();
            });
        })
    } else if (userAgent.match(/Android/i)) {
        $(".nativelink").each(function(index, el) {
            var redirectUrl = "";
            var type = $(el).attr("data-type");

            redirectUrl = classSelf.nativeRedirectUrl + type;

            $(el).attr("href", redirectUrl);
        });

    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ChangxiangkaController;
});
