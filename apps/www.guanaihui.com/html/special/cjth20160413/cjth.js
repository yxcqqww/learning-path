/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：today-special(今日特惠页面)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CjThController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    this.loadProduct();
}

/*top栏获取一些东西*/
CjThController.prototype.loadProduct=function(){
    var Floor_1_API = '/template/getActivityData?id=1000&type=2',
        Floor_2_API = '/template/getActivityData?id=1001&type=2',
        Floor_3_API = '/template/getActivityData?id=1002&type=2',
        J_floor_1 = $('#J_floor_1'),
        J_floor_2 = $('#J_floor_2'),
        J_floor_3 = $('#J_floor_3');
    (function($) {
        $.ajax({
            url: Floor_1_API,
            dataType: 'JSONP',
            success: function(data) {
                var html = '';

                $.each(data.result, function(index, item) {
                    html += '<li><a href="' + item.linkUrl + '"><img src="' + item.item.logo + '"><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
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
                    html += '<li><a href="' + item.linkUrl + '"><img src="' + item.item.logo + '"><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
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
                    html += '<li><a href="' + item.linkUrl + '"><img src="' + item.item.logo + '"><p class="t">' + item.item.name + '</p><p class="yj">原价：' + item.item.retailedPrice + '元</p><p class="xj">优惠价：¥<span>'+item.item.discountedPrice+'</span></p><button class="buy">立即抢购</button></a></li>';
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
    new CjThController;
});
