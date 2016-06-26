/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：booking(填写预约信息)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function IndexController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    datepicker初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initDatePicker();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登记体检人信息操作
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.addResevePerson();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    是否需要发票事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.invoiceCheckListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    使用优惠码事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.couponListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面表单提交
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();

};
/*top栏获取一些东西*/
IndexController.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 datepicker初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.initDatePicker = function() {
    var datesEnabled = $(".datepicker").attr("data-input") ? JSON.parse($(".datepicker").attr("data-input")) : [];
    $('.date').datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        todayHighlight: false,
        autoclose: true,
        startDate: $('.datepicker').attr("data-start"),
        endDate: '+60d',
        datesEnabled: datesEnabled
    });

    $("#reserveDate").val('');

    //这里当日期改变的时候需要改变提交订单的日期
    $(".date").change(function() {
        var _this = $(this);
        $("#reserveDate").val(_this.find("input").val());
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 登记体检人信息操作
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.addResevePerson = function() {
    var classSelf = this;
    require([
        classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
        classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
    ], function() {
        //判断checkbox是否勾选
        //收件人姓名
        $("#chbName").click(function() {
            var _this = $(this),
                _isChecked = _this.is(':checked')
            if (_isChecked) {
                //选中,就隐藏
                $("#reportReceiver").parent(".form-group").slideUp();
            } else {
                //未选中
                $("#reportReceiver").parent(".form-group").slideDown();
            }
        });
        //收件人手机号
        $("#chbMobile").click(function() {
            var _this = $(this),
                _isChecked = _this.is(':checked');
            if (_isChecked) {
                //选中,就隐藏
                $("#reportReceiverPhoneNumber").parent(".form-group").slideUp();
            } else {
                //未选中
                $("#reportReceiverPhoneNumber").parent(".form-group").slideDown();
            }
        });

        //证件类型发生改变时
        $("#idType").change(function() {
            var _this = $(this),
                _value = _this.val(); //1是身份证 2是护照
            if (_value === "1") {
                $("#idNumber").attr("data-validation-engine", "validate[required,custom[idCard]]");
            } else {
                $("#idNumber").attr("data-validation-engine", "validate[required]");
            }
        });

        //选择性别
        $(".three-column >div").click(function() {
            var _this = $(this);
            _this.addClass("selected").siblings().removeClass("selected");
        })

        //添加体检人btnAddPerson点击事件
        $("#reseveMedical").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
            validationEventTrigger: '',
            scroll: false
        });
        $("#btnAddPerson").click(function() {
            //先取到所有需要的值
            var userName = $("#userName").val(), //预约人姓名
                chbName = $("#chbName").is(':checked'), //同报告收件人姓名
                phoneNumber = $("#phoneNumber").val(), //联系电话
                chbMobile = $("#chbMobile").is(':checked'), //同报告收件人手机
                gender = "", //性别
                married = "", //婚否
                idType = $("#idType").val(), //证件类型
                idNumber = $("#idNumber").val(), //证件号码
                reportReceiver = $("#reportReceiver").val(), //报告收件人姓名
                reportReceiverPhoneNumber = $("#reportReceiverPhoneNumber").val(), //报告收件人手机
                reportReceiveAddr = $("#reportReceiveAddr").val(); //报告收件人地址

            //处理报告收件人和报告收件人手机号码
            chbName ? reportReceiver = userName : '';
            chbMobile ? reportReceiverPhoneNumber = phoneNumber : '';

            //处理性别
            var genderVal = $(".three-column div.selected").attr("data-value");
            if (!genderVal) {
                classSelf.tips("<span class=\"text-danger\">请选择性别！</span>", 3);
                return false;
            }
            if (genderVal == "1") {
                //男
                gender = 1;
                married = 0;
            } else if (genderVal == "2") {
                //女未婚
                gender = 0;
                married = 0;
            } else if (genderVal == "3") {  
                //女已婚
                gender = 0;
                married = 1;
            } 
            var validate = $("#reseveMedical").validationEngine('validate');

            if (!validate) {
                return false;
            }
            //获取已经添加的体检人的数量
            var personNumber = parseInt($("#personNumber").val()) + 1;

            //将新添加的表单数据包装成对应的格式
            var testPerson = {
                "index": personNumber,
                "userName": userName, //预约人姓名
                "chbName": chbName, //同报告收件人姓名
                "phoneNumber": phoneNumber, //联系电话  
                "chbMobile": chbMobile, //同报告收件人手机
                "gender": gender, //性别
                "married": married, //婚否
                "idType": idType, //证件类型
                "idNumber": idNumber, //证件号码
                "reportReceiver": reportReceiver, //报告收件人姓名
                "reportReceiverPhoneNumber": reportReceiverPhoneNumber, //报告收件人手机
                "reportReceiveAddr": reportReceiveAddr //报告收件人地址
            };

            //这里先要去判断是否添加重复的人
            if (!classSelf.deDuplication(testPerson)) {
                return false;
            }

            //如果添加成功，需要修改数量
            $("#personNumber").val(personNumber);

            //更新提交表单里的数据
            classSelf.packageListData(testPerson);
            //拼接表格的数据
            classSelf.generateTable();
            //计算人数和支付金额
            classSelf.calculateAmount();
        });

        //点击删除按钮时
        $(".person-list").on('click', 'tr[class!="example"] .icon-shanchu1', function() {
            var _thisTr = $(this).parents("tr"),
                _thisIndex = _thisTr.attr("data-index");
            classSelf.confirm({
                'content': '您确认要删除么？',
                'confirmInterface': function() {
                    //更新提交表单预约列表
                    classSelf.packageListData({}, _thisIndex);
                    //更新提交表单人数
                    var personNumber = parseInt($("#personNumber").val());
                    $("#personNumber").val(personNumber - 1);
                    //生成表格
                    classSelf.generateTable();
                    //计算人数和支付金额
                    classSelf.calculateAmount();
                }
            });
        });
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
判断是否添加重复的人员，比较身份证号和护照
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.deDuplication = function(testPerson) {
    var classSelf = this;
    var result = true,
        alreadyListData = $("#reserveListInfo").val() ? JSON.parse($("#reserveListInfo").val()) : [];
    for (var i = 0, len = alreadyListData.length; i < len; i++) {
        if (testPerson.idType === alreadyListData[i].idType) {
            if (testPerson.idNumber === alreadyListData[i].idNumber) {
                classSelf.tips("<span class=\"text-danger\">您已经添加过该体检人信息，请勿重复添加！</span>", 5);
                result = false;
                return result;
            }
        }
    }
    return result;
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 计算价格和改变体检人数
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.calculateAmount = function() {
    var classSelf = this;
    var unitPrice = parseFloat($("#unitPrice").val()), //单价
        payInfoNumber = parseInt($(".person-list tbody tr[class!='example']").size()), //人数
        lblCouponAmount = parseInt($("#lblCouponAmount").attr("data-value") || 0), //优惠码的价格
        actualAmount = unitPrice * payInfoNumber - lblCouponAmount; //使用优惠码之后的价格

    $("#payInfoNumber").text(payInfoNumber);
    //这里要计算优惠码的值是否大于需要付款的值
    if (actualAmount < 0 && lblCouponAmount != 0) {
        actualAmount = unitPrice * payInfoNumber;
        $("#couponContent").hide();
        $("#couponBox").show().find("input").val("");
        classSelf.tips("<span class='text-danger'>优惠码的抵扣金额为" + lblCouponAmount + ",大于实际支付金额！</span>", 3, function() {
            $("#lblCouponCode").text(" ").attr("data-value", "");
            $("#lblCouponAmount").text(" ").attr("data-value", "");
            $("#promoteCodeInfo").val("");
            $("#promoteCodeAmount").val("");
            $(".amount").text(actualAmount.toFixed(2));
            $("#totalPay").val(actualAmount.toFixed(2));
        });
    } else {
        $(".amount").text(actualAmount.toFixed(2));
        $("#totalPay").val(actualAmount.toFixed(2));
    }
    //这里需要更新人数和价格
    $("#reserveNum").val(payInfoNumber);
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 生成表格
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.generateTable = function() {
    var classSelf = this;
    var result = $("#reserveListInfo").val() ? JSON.parse($("#reserveListInfo").val()) : [],
        trHtml = '';
    //这里要判断tr的数量，如果为0，需要将示例显示出来
    if (result.length == 0) {
        trHtml += '<tr class="example"><td><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><i class="iconfont icon-shanchu1"></i></a></td><td>1</td><td>示例</td><td>**************1125</td><td>*******6789</td><td>示例</td><td>*******6789</td><td>上海市徐汇区吴中东路555号</td></tr>';
    }
    for (var i = 0, len = result.length; i < len; i++) {
        trHtml += '<tr data-index = "' + result[i].index + '" data-value=' + JSON.stringify(result[i]) + '>';
        trHtml += '<td><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><i class="iconfont icon-shanchu1"></i></a></td>';
        trHtml += '<td>' + (i + 1) + '</td>';
        trHtml += '<td>' + result[i].userName + '</td>';
        trHtml += '<td>' + result[i].idNumber + '</td>';
        trHtml += '<td>' + result[i].phoneNumber + '</td>';
        trHtml += '<td>' + result[i].reportReceiver + '</td>';
        trHtml += '<td>' + result[i].reportReceiverPhoneNumber + '</td>';
        trHtml += '<td>' + result[i].reportReceiveAddr + '</td>';
        trHtml += '</tr>';
    }
    $(".person-list table tbody").html(" ").append($(trHtml));
    $(".person-list tbody tr td a[data-toggle='tooltip']").tooltip();

    //将表单信息清空
    $("#userName").val("");
    $("#phoneNumber").val("");
    $("#idNumber").val("");
    $("#reportReceiver").val("");
    $("#reportReceiverPhoneNumber").val("");
    $("#reportReceiveAddr").val("");
    $(".three-column div").removeClass("selected");
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 是否需要发票事件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.invoiceCheckListener = function() {
    //是否需要发票
    $("#invoiceCheck").click(function() {
        var _this = $(this),
            _isChecked = _this.is(':checked');

        var lblInvoiceTitle = $.trim($("#lblInvoiceTitle").html());

        if (_isChecked) {
            if (lblInvoiceTitle.length === 0) {
                $(".invoiceBox").slideDown()
            } else {
                $("#invoiceContent").slideDown();
            }
        } else {
            //重置

            $("#iptTitle").val('');
            $("#txtInvoiceAddress").val('');
            $("#invoiceTitleType span").removeClass('selected');
            $("#invoiceTitleType span:first").addClass('selected');
            $("#invoiceContentType span").removeClass('selected');
            $("#invoiceContentType span:first").addClass('selected');
            $(".invoiceBox .errorMsg").hide();


            //隐藏
            $(".invoiceBox").hide();
            $("#invoiceContent").hide();
        }
    });
    //确认需要发票按钮或者取消按钮事件
    $(".tool-box .btn").click(function() {
        var _this = $(this),
            _flag = _this.attr("data-flag");

        var lblInvoiceTitle = $.trim($("#lblInvoiceTitle").html());

        if (_flag === "cancle") {
            //如果是取消的话并
            if (lblInvoiceTitle.length != 0) {
                $(".invoiceBox").slideUp();
                $("#invoiceContent").slideDown();
            } else {
                //重置
                $("#iptTitle").val('');
                $("#txtInvoiceAddress").val('');
                $("#invoiceTitleType span").removeClass('selected');
                $("#invoiceTitleType span:first").addClass('selected');
                $("#invoiceContentType span").removeClass('selected');
                $("#invoiceContentType span:first").addClass('selected');
                $(".invoiceBox .errorMsg").hide();


                $(".invoiceBox").hide();
                $("#invoiceCheck").removeAttr("checked");
            }

        } else {
            //如果点击确认的时候,先
            var invoiceType = $("#invoiceType").find("span.selected").attr("data-value"), //发票信息
                invoiceTypeValue = $("#invoiceType").find("span.selected").attr("data-name"),
                invoiceTitleType = $("#invoiceTitleType").find("span.selected").attr("data-value"), //抬头信息
                invoiceTitleTypeValue = $("#invoiceTitleType").find("span.selected").attr("data-name"),
                iptTitle = $("#iptTitle").val(), //抬头名称
                txtInvoiceAddress = $("#txtInvoiceAddress").val(), //寄送地址
                invoiceContentType = $("#invoiceContentType").find("span.selected").attr("data-name"), //发票内容
                invoiceContentTypeValue = $("#invoiceContentType").find("span.selected").attr("data-value");

            if (iptTitle == "") {
                $("#iptTitle").next("span.errorMsg").show();
                return false;
            } else {
                $("#iptTitle").next("span.errorMsg").hide();
            }
            if (txtInvoiceAddress == "") {
                $("#txtInvoiceAddress").next("span.errorMsg").show();
                return false;
            } else {
                $("#txtInvoiceAddress").next("span.errorMsg").hide();
            }

            $(".invoiceBox").slideUp();
            //填充发票数据
            $("#invoiceContent #lblInvoiceType").text(invoiceTypeValue).attr("data-value", invoiceType);
            $("#invoiceContent #lblInvoiceTitleType").text(invoiceTitleTypeValue).attr("data-value", invoiceTitleType);
            $("#invoiceContent #lblInvoiceTitle").text(iptTitle);
            $("#invoiceContent #lblInvoiceAddress").text(txtInvoiceAddress);
            $("#invoiceContent #lblInvoiceContentType").text(invoiceContentType).attr("data-value", invoiceContentTypeValue);
            $("dd#invoiceContent").show();

            //这里需要更新提交表单的数据
            var checkData = {
                "type": invoiceType, //发票信息
                "titleType": invoiceTitleType, //标题类别
                "title": iptTitle, //标题
                "address": txtInvoiceAddress, //寄送地址
                "content": invoiceContentTypeValue //内容
            };

            $("#checkInfo").val(JSON.stringify(checkData));
        }
    });
    //修改发票按钮
    $("#invoiceContent a[data-flag='edit']").click(function() {
        var _this = $(this);

        var lblInvoiceType = $("#lblInvoiceType").attr("data-value");
        var lblInvoiceTitleType = $("#lblInvoiceTitleType").attr("data-value");
        var lblInvoiceTitle = $.trim($("#lblInvoiceTitle").html());
        var lblInvoiceAddress = $.trim($("#lblInvoiceAddress").html());
        var lblInvoiceContentType = $("#lblInvoiceContentType").attr("data-value");

        $("#iptTitle").val(lblInvoiceTitle);
        $("#txtInvoiceAddress").val(lblInvoiceAddress);

        $("#invoiceTitleType span").removeClass('selected');
        $("#invoiceTitleType").find("span[data-value='" + lblInvoiceTitleType + "']").addClass('selected');

        $("#invoiceContentType span").removeClass('selected');
        $("#invoiceContentType").find("span[data-value='" + lblInvoiceContentType + "']").addClass('selected');


        _this.parents("dd").hide();
        $(".invoiceBox").slideDown();
    });

    //绑定点击事件
    $(".invoiceBox dd span").click(function() {
        var _this = $(this);
        _this.addClass("selected").siblings("span").removeClass("selected");
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 使用优惠码事件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.couponListener = function() {
    var classSelf = this;
    //是否需要优惠码
    $("#promoCheck").click(function() {
        var _this = $(this),
            _isChecked = _this.is(':checked');

        $("#couponBox input").val(''); 
        if (_isChecked) {
            $("#couponBox").slideDown();
        } else {
            $("#couponBox").slideUp()
            $("#couponContent").slideUp();

            //清空优惠码信息
            $("#lblCouponCode").text('').attr("data-value", "");
            $("#lblCouponAmount").attr("data-value", 0);
            $("#promoteCodeInfo").val("");
            $("#promoteCodeAmount").val(0);

            classSelf.calculateAmount();
        }

    });
    //点击确认使用优惠码
    $("#couponBox .input-group-addon").click(function() {
        var promoteCode = $("#couponBox input").val();
        if (!promoteCode || promoteCode == "") {
            //$(".promoteError").show();
            classSelf.tips("<span class=\"text-danger\">请输入正确的优惠码</span>", 3);
            return false;
        } else {
            //判断是否是数字
            if (!/^\d*$/g.test(promoteCode)) {
                classSelf.tips("<span class=\"text-danger\">无效的优惠码</span>", 3);
                return false;
            }
        }

        var param = {
            process: function(data) {
                //这里如果优惠码验证成功,需要更新表单需要提交的数据
                if (data.result) {
                    $("#couponBox").hide();
                    $("#couponContent").show();
                    $("#lblCouponCode").text($.trim($("#couponBox input").val())).attr("data-value", $.trim($("#couponBox input").val()));
                    $("#lblCouponAmount").text(parseFloat(data.result.promoAmt)).attr("data-value", parseFloat(data.result.promoAmt));
                    $("#promoteCodeInfo").val($.trim($("#couponBox input").val()));
                    $("#promoteCodeAmount").val(parseFloat(data.result.promoAmt));
                    classSelf.calculateAmount();
                } else {
                    classSelf.tips("<span class=\"text-danger\">无效的优惠码</span>", 3);
                }
            },
            onExceptionInterface: function(code, message) {

            }
        };

        classSelf.request(classSelf.promoteCodeApiUrl, {
            "pcode": promoteCode
        }, param);
    });


    //点击取消优惠码事件
    $("#couponContent a").click(function() {
        $("#couponContent").hide();
        $("#couponBox").show().find("input").val("");
        $("#lblCouponCode").text(" ").attr("data-value", "");
        $("#lblCouponAmount").text(" ").attr("data-value", "");
        $("#promoteCodeInfo").val("");
        $("#promoteCodeAmount").val("");
        classSelf.calculateAmount();
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 拼接提交的隐藏表单所需要的数据
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.packageListData = function(testPerson, removeIndex) {
    //这里需要更新提交表单数据
    var personListData = $("#reserveListInfo").val() ? JSON.parse($("#reserveListInfo").val()) : [],
        hasProp = false;
    for (var prop in testPerson) {
        hasProp = true;
        break;
    }
    if (hasProp) {
        personListData.push(testPerson);
    }

    if (removeIndex) {
        for (var i = 0, len = personListData.length; i < len; i++) {
            if (personListData[i].index == removeIndex) {
                personListData.splice(i, 1);
                break;
            }
        }
    }
    var listResult = personListData.length ? JSON.stringify(personListData) : "";
    $("#reserveListInfo").val(listResult);
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
表单提交按钮点击事件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.submitForm = function() {
    var classSelf = this;


    $("#submitForm button").on("click", function() {

        //判断预约日期是否已选
        if ($("#reserveDate").val().length === 0) {
            classSelf.tips("<span class=\"text-danger\">请先选择预约日期！</span>", 3);
            return false;
        }

        if ($("#reserveListInfo").val().length === 0) {
            classSelf.tips("<span class=\"text-danger\">请先登记体检人信息！</span>", 3);
            return false;
        }

        var requestData = {
            "sId": $("input[name='sId']").val(),
            "pId": $("input[name='pId']").val(),
            "bookingStoreDate": $("input[name='bookingStoreDate']").val(),
            "quantity": $("input[name='quantity']").val(),
            "amount": $("input[name='amount']").val(),
            "invoice": $("input[name='invoice']").val(),
            "promoCode": $("input[name='promoCode']").val(),
            "promoCodeChargeAmt": $("input[name='promoCodeChargeAmt']").val(),
            "customer": $("input[name='customer']").val()
        };

        classSelf.request($('#submitForm').attr("action"), requestData, { 
            process: function(data) {
                window.location.href = data.result.redirect;
            }
        });

        // GA监测
        ga('send', 'event', 'bodyck', 'gopay', '马上支付体检');

        return false;
    });

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController;
});
