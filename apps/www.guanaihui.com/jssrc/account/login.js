/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：login.js(登录)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function LoginController(params) {

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登录
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送短信
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    // this.sendSms();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    更新验证码
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    // this.refreshValidateCode();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登录成功之后的callback function
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    if (params != undefined && params.successCallback != undefined) {
        this.successCallback = params.successCallback;
        this.successHandler = params.successHandler;
    };

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    短信验证码输入框增加Enter事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
登陆
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
LoginController.prototype.submitForm = function() {
    var classSelf = this;
    require([
        classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
        classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
    ], function() {
        $("#loginForm").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
            validationEventTrigger: '',
            scroll: false
        });

    });

    $('#txtMobile').blur(function(event) {
        var mobile=$('#txtMobile').val();
        classSelf.request(classSelf.checkPhoneNumUrl,{"mobile":mobile},{
            process:function(data){
                if(data.code!=200){
                    classSelf.tips(data.message,2);
                }
            }
        })
    });
}
$(document).ready(function() {
    new LoginController;
});
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
发送短信
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// LoginController.prototype.sendSms = function() {
//     var classSelf = this;
//     require([
//         classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
//         classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
//     ], function() {
//         $("#loginForm").validationEngine({
//             promptPosition: 'topLeft',
//             autoHidePrompt: true,
//             autoHideDelay: 5000,
//             showOneMessage: true,
//             maxErrorsPerField: 1,
//             validationEventTrigger: '',
//             scroll: false
//         });

//         $("#btnGetSmsCode").on('click', function(e) {
//             var time = 60;
//             var _this = $(this);
//             var valid;
//             var $mobileInput = $("#txtMobile");
//             var $smsCode = $("#txtSmsCode");
//             var $validateCode = $("#txtValidateCode");

//             if ($smsCode.attr("data-validation-engine") != undefined) {
//                 $smsCode.removeAttr('data-validation-engine');
//                 $smsCode.removeAttr('data-errormessage-value-missing');
//             }

//             valid = $("#loginForm").validationEngine('validate');

//             if (!valid) {
//                 return false;
//             };

//             if (_this.hasClass('.disabled')) {
//                 return false;
//             }

//             var data = {
//                 "mobile": $.trim($mobileInput.val()),
//                 "captcha": $.trim($validateCode.val()),
//                 "t": "1"
//             };



//             var param = {
//                 process: function(result) {
//                     _this.addClass('disabled');
//                     $smsCode.attr('data-validation-engine', 'validate[required]');
//                     $smsCode.attr('data-errormessage-value-missing', '短信动态码不能为空');

//                     var t = window.setInterval(function() {
//                         time = time - 1;
//                         _this.html('重新发送(' + time + 's)');
//                         if (time === 0) {
//                             _this.html('获取动态密码');
//                             _this.removeClass('disabled')
//                             $smsCode.removeAttr('data-validation-engine');
//                             $smsCode.removeAttr('data-errormessage-value-missing');
//                             window.clearInterval(t);
//                         }
//                     }, 1000);
//                 },
//                 onExceptionInterface: function(code, message) {
//                     // classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5);
//                     var timestamp = Date.parse(new Date());
//                     $('span.change').prev("img").attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
//                 }
//             };

//             classSelf.request(classSelf.sendSmsApiUrl, data, param);

//             e.preventDefault();
//         });
//     });
// }

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
更新验证码
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// LoginController.prototype.refreshValidateCode = function() {
//     var classSelf = this;
//     $('span.change').on("click", function() {
//         var $validateImg = $(this).prev("img");
//         var timestamp = Date.parse(new Date());
//         $validateImg.attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
//     });

//     $('span.change').prev("img").on("click", function() {
//         var timestamp = Date.parse(new Date());
//         $(this).attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
//     });
// }

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
短信验证码输入框增加Enter事件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*LoginController.prototype.bindSmsCodeInput = function() {
    var classSelf = this;
    var $smsCodeInput = $("#txtSmsCode");
    var $disabledEnterInput = $("#txtMobile,#txtValidateCode");
    var $btn = $("#btnLogin");

    $smsCodeInput.bind("keypress", function(e) {
        if (event.keyCode == "13" && $(this).attr("id") === "txtSmsCode") {
            $btn.click();
            e.preventDefault();
        }
    });
    $disabledEnterInput.bind("keypress", function(e) {
        if (event.keyCode == "13") {
            return false;
        }
    });
};*/

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

