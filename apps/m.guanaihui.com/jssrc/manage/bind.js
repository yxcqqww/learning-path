/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.guanaihui.com
 2. 页面名称：Native Hybrid 礼品卡绑定
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function BindController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     app native 调用方法初始化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.appBridge();
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app native 调用方法初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BindController.prototype.appBridge = function() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        var connectWebViewJavascriptBridge = function(callback) {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    callback(WebViewJavascriptBridge)
                }, false);
            }
        };

        // 调用connectWebViewJavascriptBridge方法
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.init(function(message, responseCallback) {
                responseCallback(responseData)
            })

            $(".btn-block").on("click", function() {
                var cardNo = $.trim($("#txtCarNo").val());
                var password = $.trim($("#txtPassword").val());
                var errorData = {};
                var requestData = {};

                if (cardNo.length === 0) {
                    errorData.code = "0001";
                } else {
                    errorData.code = "0002";
                }

                if (errorData.code) {
                    bridge.send(window.JSON.stringify(errorData), function(responseData) {})
                } else {
                    requestData.cardNo = cardNo;
                    requestData.password = password;
                    bridge.send(window.JSON.stringify(requestData), function(responseData) {})
                }
            });
        })
    } else if (userAgent.match(/Android/i)) {
        $(".btn-block").on("click", function() {
            var cardNo = $.trim($("#txtCarNo").val());
            var password = $.trim($("#txtPassword").val());
            if (cardNo.length === 0) {
                jsinterface_showtip.show("0001" /*卡号不能为空*/ );
                return;
            }

            if (password.length === 0) {
                jsinterface_showtip.show("0002" /*密码不能为空*/ );
                return;
            }

            jsinterface_bind.bind(cardNo, password);
        });
    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new BindController;
});
