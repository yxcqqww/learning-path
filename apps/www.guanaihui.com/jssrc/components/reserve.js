/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. reserve-nmodule(预约module框)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function Reserve(params) {
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化日历控件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.init();
    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    监测门店下拉列表变换
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    // this.addListenerToStoreList();
    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    提交表单
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm(params);
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化日历控件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.init = function() {
    $(".btn-reserve").click(function(event) {
        officeHoursPart=[];
        var storeTime=$('.des').find('.store-time').html(); //8:30-10:00 （周六周日休息）
        startTime=storeTime.substring(0,storeTime.indexOf('\-'));
        endTime=storeTime.substring(storeTime.indexOf('\-')+1,storeTime.indexOf('\-')+6);
        officeHoursPart.push(startTime,endTime);
        $.each(officeHoursPart,function(index, el) {
            if(el.split(':')[1]!='00'){
                if(index==0){
                    startOfficeHours=Number(el.split(':')[0])+1;
               }else{
                    endOfficeHours=Number(el.split(':')[0])+1;
               }
            }else{
               if(index==0){
                    startOfficeHours=Number(el.split(':')[0]);
               }else{
                    endOfficeHours=Number(el.split(':')[0]);
               }
            }
        });
        PartTimeNum = endOfficeHours - startOfficeHours;
    }); 
    $("#btnReserve").prop('disabled',true);
    var _this = this,
        appendTime=0,
        weekDay='',
        startDate = $('#datepicker').attr('data-date'),
        sDay = [];
    var endDate = new Date(startDate).add(2).months().toString('yyyy/M/d');

    if ($('#J_disabled').length && $('#J_disabled').val() !== "") {
        var datesDisableds = $('#J_disabled').val().split(',');
        var res = datesDisableds[0].split('/');
        var res2 = datesDisableds[1].split('/');
        var year = res[0];
        var year2 = res[1];
        var month = res[1] - 1;
        var month2 = res2[1] - 1;

        var day1 = datesDisableds[0].split('/')[2];
        var day2 = datesDisableds[1].split('/')[2];
        var d1 = new Date();
        var d2 = new Date();

        d1.setFullYear(year, month, day1);
        d2.setFullYear(year, month2, day2);
        sDay = [d1, d2];
    }
    var date=new Date();
    var date2=new Date();
    
    //console.log(date.getDate());
    //var nextDate=date2.setDate(date2.getDate()+1);
    sDay.push(date);
    $('#datepicker')
        .datepicker({
            format: 'yyyy/mm/dd',
            language: 'zh-CN',
            startDate: startDate,
            endDate: endDate,
            datesDisabled: sDay
        })
        .on('changeDate', function() {
            console.log(PartTimeNum);
            if(date2.getDate()!=Number($('#datepicker .datepicker-days tbody').find('.active').html())){
                $("#btnReserve").prop('disabled',false);
            }
            $('#module-reserve .date #datepicker').css('padding','0 0 10px');
            $('#datepicker').css('width','305px');
            $('.date h3').html('选择时段');
            $('#hiddenDate').val($('#datepicker').datepicker('getFormattedDate'));
            var ththree=$('#datepicker .datepicker-days thead tr').eq(1).children('th').eq(1).html();
            var thtime=$('#datepicker .datepicker-days tbody').find('.active').html();
            var week=$('#datepicker .datepicker-days tbody tr').find('.active').parent('tr').children();
            for(var i=0;i<week.length;i++){
                if(week.eq(i).hasClass('active')){
                    var x=i+1;
                }
            }
            if(x==1){
                weekDay='星期一';
            }else if(x==2){
                weekDay='星期二';
            }else if(x==3){
                weekDay='星期三';
            }else if(x==4){
                weekDay='星期四';
            }else if(x==5){
                weekDay='星期五';
            }else if(x==6){
                weekDay='星期六';
            }else if(x==7){
                weekDay='星期日';
            }
            $('.datepicker-inline').hide();
            if(appendTime==0){
                $('#datepicker').append('<h4 id="adBack" style=""><i class="backDate "><</i>'+ththree+thtime+'号'+' '+weekDay+'</h4>');
                // 动态添加select节点的个数
                var $sel=$(document.createElement("SELECT")).attr('id','sel').css({
                    'width':'200px',
                    'height':'20px',
                    'display':'block',
                    'margin':'0 auto',
                    'color':'#000000'
                });
                var $options='';
                if(PartTimeNum){
                    for(var n=0;n<PartTimeNum;n++){
                        startOfficeHours=Number(startOfficeHours);
                        if(startOfficeHours<10){
                            startOfficeHours='0'+startOfficeHours;
                        }
                        console.log(startOfficeHours);
                        $options+='<option>'+startOfficeHours+':00-';
                        startOfficeHours=Number(startOfficeHours);
                        startOfficeHours++;
                        if(startOfficeHours<10){
                            startOfficeHours='0'+startOfficeHours;
                        };
                        $options+=startOfficeHours+':00</option>';
                    }
                }else{
                    for(var n=8;n<22;n++){
                        var m=n+1;
                        if(n<10){
                           n= '0'+n;
                        }
                        if(m<10){
                           m= '0'+m;
                        }
                        $options+='<option>'+n+':00-';
                        $options+=m+':00</option>';
                    }
                }
                $sel.append($options);
                $('#datepicker').append($sel);
                for(var t=0;t<$('#sel').children('option').length;t++){
                    if($('#sel').children('option').eq(t).prop('selected')){
                        console.log($('#sel').children('option:selected').eq(t).html());
                        $('#bookingEndTime').val($('#sel').children('option:selected').eq(t).html());
                    }
                }
                $('#bookingEndTime').val($('#sel').children('option:selected').html());
                appendTime++;
            }else{
                $('#datepicker h4').html('<span class="backDate">&lt;&lt;</span>'+ththree+thtime+'号'+' '+weekDay);
                $('#datepicker #sel').show();
                $('#datepicker h4').show();
            }
            for(var o=0;o<$('#sel').children('option').length;o++){
                if($('#sel').children('option').eq(o).prop('selected')){
                    console.log($('#sel').children('option:selected').eq(o).html());
                    $('#bookingEndTime').val($('#sel').children('option:selected').eq(o).html());
                }
            }
        });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
监测门店下拉列表变换
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.addListenerToStoreList = function() {
    $("#storeId").val($(".selected-label").attr("data-id"));
    $("#module-reserve .dropdown-menu li").click(function() {
        var $this = $(this),
            data_id = $this.attr("data-id"),
            storeItem = $($this.find("a").html());
        $(".selected-label").attr("data-id", data_id).html(" ").append(storeItem);
        $("#storeId").val($(".selected-label").attr("data-id"));
    })
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
提交预约
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.submitForm = function(params) {
    if ($("#btnReserve").size() === 0) return 0;
    var _this = this;
    //加减号的处理
    $(".add").click(function() {
        var pnum = parseInt($("input[name='pnum']").val());
        if(pnum <= 9999){
            pnum++;
            priceHandler(pnum);
        }
    });
    $(".min").click(function() {
        var pnum = parseInt($("input[name='pnum']").val());
        if(pnum > 1){
            pnum--;
            priceHandler(pnum);
        }

    });
    $("[name='pnum']").blur(function(){
        var pnum = parseInt($(this).val());
        if(pnum > 0 && pnum < 10000){
            priceHandler(pnum);
        }
    });
    // 价格处理
    function priceHandler(pnum){
        $("input[name='pnum']").val(pnum);
        var discountedPrice = $("#discountedPrice").val();
        if(parseFloat(discountedPrice)>0){
            var amount = parseFloat(discountedPrice) * pnum;
            amount = amount.toString().indexOf(".") ? Math.floor(amount*100)/100:amount;
            $(".price").find(".amount").text(amount);
        }
    }

    $("#btnReserve").click(function() {
        var $this = $(this);
        $this.addClass("disabled").html('正在提交数据...');
        var data = {
            "bookingDate": $.trim($("#hiddenDate").val()),
            "shopId": $("#shopSelector").find(".dropdown-menu li[data-selected='selected']").attr("data-id"),
            "count": $.trim($("input[name='pnum']").val()),
            "productId": $.trim($("#productId").val()),
            "bookingOrigin":$.trim($("#bookingOrigin").val()),
            "bookEndTime":$.trim($('#bookingEndTime').val())
        };

        var param = {
            type: "POST",
            // 成功调用预约接口回掉
            process: function(data) {
                //特殊处理价格，如果有redirect，则直接redirect到相应的url
                if (data.result && data.result.redirect) {
                    window.location.href = data.result.redirect;
                } else {
                    $('#module-reserve').modal('hide');
                    _this.reserveSuccessCallback();
                }
            },
            onExceptionInterface: function(data) {
                $this.removeClass("disabled").html('确定预约');
                //如果session过期，直接弹出登录注册模态窗口
                if (data.code.toString() === "911") {
                    $(".toper .pull-right a").remove();
                    $(".toper .pull-right").append("<a id='toperLogin' href='/login'>登录</a><a id='toperRegister' href='/register'>注册</a>");
                    $('#module-reserve').modal('hide');
                    params.popUpAccoountModule();
                }
            }
        };
        _this.request(_this.reserveApiUrl, data, param);
    })
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 预约成功后执行函数
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.reserveSuccessCallback = function() {
    var _this = this;
    if ($("#module-reserveSuccess").size() === 0) {
        _this.dialog({
            "tabindex": 2,
            "id": "module-reserveSuccess",
            "effect": false,
            "url": "/product/booking/success"
        });
    } else {
        $('#module-reserveSuccess').modal('show');
    }
};

$(function() {
    new Reserve;
});
