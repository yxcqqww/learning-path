/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：today-special(今日特惠页面)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function M_CjThController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    this.loadProduct();
}

/*top栏获取一些东西*/
M_CjThController.prototype.loadProduct=function(){
    var apiPrefix = '';
    var domain = document.domain;
    if(domain.indexOf('dev') != -1){
        apiPrefix = 'http://devweb.guanaihui.cn';
    }else if(domain.indexOf('stage') != -1){
        apiPrefix = 'http://testweb.guanaihui.cn';
    }else if(domain.indexOf('preview') != -1){
        apiPrefix = 'http://preweb.guanaihui.cn';
    }else if(domain.indexOf('cdn') != -1){
        apiPrefix = 'http://www.guanaihui.com';
    }
    var Floor_1_API = apiPrefix+'/template/getActivityData?id=1003&type=2',
        Floor_2_API = apiPrefix+'/template/getActivityData?id=1004&type=2',
        Floor_3_API = apiPrefix+'/template/getActivityData?id=1005&type=2',
        J_floor_1 = $('#ul_one'),
        J_floor_2 = $('#ul_two'),
        J_floor_3 = $('#ul_three');


    (function($) {
        $.ajax({
            url: Floor_1_API,
            dataType: 'JSONP',
            success: function(data) {
                var html = '';

                $.each(data.result, function(index, item) {
                    html += '<li><a href="javascript:void(0)" ' + item.linkUrl + ' class="btn-booking"><div class="img"><img src="' + item.item.logo + '"></div><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
                });

                J_floor_1.html(html);
            }
        });
        $.ajax({
            url: Floor_2_API,
            dataType: 'JSONP',
            success: function(data) {
                var html = '';

                $.each(data.result, function(index, item){
                    html += '<li><a href="javascript:void(0)" ' + item.linkUrl + ' class="btn-booking"><div class="img"><img src="' + item.item.logo + '"></div><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
                });

                J_floor_2.html(html);
            }
        });
        $.ajax({
            url: Floor_3_API,
            dataType: 'JSONP',
            success: function(data) {
                var html = '';

                $.each(data.result, function(index, item){
                    html += '<li><a href="javascript:void(0)" ' + item.linkUrl + ' class="btn-booking"><div class="img"><img src="' + item.item.logo + '"></div><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
                });

                J_floor_3.html(html);
            }
        });
    }(jQuery));
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new M_CjThController;
});
