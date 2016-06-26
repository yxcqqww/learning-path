/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：passwordset.js(设定密码)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function PasswordController(params) {
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
    this.sendSms();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    更新验证码
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    // this.refreshValidateCode();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    注册成功之后的callback function
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    if (params != undefined && params.successCallback != undefined) {
        this.successCallback = params.successCallback;
        this.successHandler = params.successHandler;
    };

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    短信验证码输入框增加Enter事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bindSmsCodeInput();
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
登陆  
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
PasswordController.prototype.submitForm = function() {

    var classSelf = this;
    require([
        classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
        classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
    ], function() {
        $("#registerForm").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
            validationEventTrigger: '',
            scroll:false
        });
        $('#btnRegister').on("click",function(){
            event.preventDefault();
            // console.log(2);
            var phone = $("#txtRegisterMobile").val();   
            var pattern=/^1\d{10}$/;                              
            var duanInfo = $("#txtRegisterSmsCode").val(); 
            var patternWord=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,20}$/; 
            var setWord = $("#txtPassword").val();
            var setWordZ = $("#txtPasswordZ").val();
            if (!pattern.test(phone)) {
                // console.log("true");
                // alert("不是完整的11位手机号或者正确的手机号前七位"); 
                $("#txtRegisterMobile").focus();             
            }
            if (!duanInfo) {
                $("#txtRegisterSmsCode").focus();
            }
            if (!patternWord.test(setWord)) {
                 // console.log("true");
                $("#txtPassword").focus();
            }
            if (setWord!=setWordZ) {
                $("#txtPasswordZ").focus();
            }       
        })
    });

    // require([classSelf.utilStaticPrefix + '/jquery.ajaxsave.min.js'], function() {
    //     var $smsCode = $("#txtRegisterSmsCode");
    //     var $btn = $("#btnRegister");

    //     $('#registerForm').ajaxsave({
    //         dataType: classSelf.apiDataType,
    //         scroll:false,
    //         beforeSaveInterface: function() {
    //             if ($smsCode.attr('data-validation-engine') == undefined) {
    //                 $smsCode.attr('data-validation-engine', 'validate[required]');
    //                 $smsCode.attr('data-errormessage-value-missing', '短信动态码不能为空');
    //             }
    //             $("#registerForm").attr("action", classSelf.loginApiUrl);
    //             //Send GA Data
    //             ga('send', 'event', 'specialck', 'register', '弹出注册', parseInt($("#txtRegisterMobile").val()));
    //         },
    //         onSavingInterface: function() {
    //             //classSelf.tips("正在进行处理，请稍等...", 3);
    //             $btn.addClass('disabled').html("注册中...");
    //         },
    //         onErrorInterface: function() {
    //             var timestamp = Date.parse(new Date());
    //             $('span.change').prev("img").attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
    //             classSelf.tips("请求失败，请检查您的接口！", 3);
    //             $btn.removeClass('disabled').html("注册");
    //         },
    //         onSuccessInterface: function(data) {
    //             /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //             首先设置cookie
    //             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    //             if (classSelf.successCallback) {
    //                 classSelf.successCallback(data, classSelf.successHandler);
    //             } else {
    //                 window.location.href = classSelf.welcomeUrl;
    //             }
    //         },
    //         onExceptionInterface: function(message) {
    //             var timestamp = Date.parse(new Date());
    //             $('span.change').prev("img").attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
    //             classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5);
    //             $btn.removeClass('disabled').html("注册");
    //         }
    //     });
    // });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
发送短信
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
PasswordController.prototype.sendSms = function() {
    var classSelf = this;
    require([
        classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
        classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
    ], function() {
        $("#registerForm").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
            validationEventTrigger: '',
            scroll:false
        });

        $("#btnRegisterGetSmsCode").on('click', function(e) {
            var time = 60;
            var _this = $(this);
            var valid;
            var $mobileInput = $("#txtRegisterMobile");
            var $smsCode = $("#txtRegisterSmsCode");
            var $validateCode = $("#txtRegisterValidateCode");

            if ($smsCode.attr("data-validation-engine") != undefined) {
                $smsCode.removeAttr('data-validation-engine');
                $smsCode.removeAttr('data-errormessage-value-missing');
            }

            valid = $("#registerForm").validationEngine('validate');

            if (!valid) {
                return false;
            };

            if (_this.hasClass('.disabled')) {
                return false;
            }

            var data = {
                "mobile": $.trim($mobileInput.val()),
                "captcha": $.trim($validateCode.val()),
                "t":2 
            };

            var param = {
                process: function(result) {
                    _this.addClass('disabled');
                    $smsCode.attr('data-validation-engine', 'validate[required]');
                    $smsCode.attr('data-errormessage-value-missing', '短信动态码不能为空');

                    var t = window.setInterval(function() {
                        time = time - 1;
                        _this.html('重新发送(' + time + 's)');
                        if (time === 0) {
                            _this.html('获取动态码');
                            _this.removeClass('disabled')
                            $smsCode.removeAttr('data-validation-engine');
                            $smsCode.removeAttr('data-errormessage-value-missing');
                            window.clearInterval(t);
                        }
                    }, 1000);
                },
                onExceptionInterface: function(code, message) {
                    var timestamp = Date.parse(new Date());
                    $('span.change').prev("img").attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);

                  //  classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5);
                }
            };

            classSelf.request(classSelf.sendSmsApiUrl, data, param);

            e.preventDefault();
        });
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
更新验证码
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// RegisterController.prototype.refreshValidateCode = function() {
//     var classSelf = this;
//     $('span.change').on("click", function() {
//         var $validateImg = $(this).prev("#ddImg");
//         var timestamp = Date.parse(new Date());
//         $validateImg.attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
//     });

//     $('span.change').prev("#ddImg").on("click", function() {
//         var timestamp = Date.parse(new Date());
//         $(this).attr("src", classSelf.imgValidationCodeApiUrl + "?ts=" + timestamp);
//     });
// }

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
短信验证码输入框增加Enter事件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
PasswordController.prototype.bindSmsCodeInput = function() {
    var classSelf = this;
    var $smsCodeInput = $("#txtRegisterSmsCode");
    var $disabledEnterInput = $("#txtRegisterMobile,#txtRegisterValidateCode");
    var $btn = $("#btnRegister");


    $smsCodeInput.bind("keypress", function(e) {
        if (event.keyCode == "13") {
            $btn.click();
            e.preventDefault();
        }
    });
    $disabledEnterInput.bind("keypress", function(e) {
        if (event.keyCode == "13") {
            return false;
        }
    });


}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new PasswordController;
});
