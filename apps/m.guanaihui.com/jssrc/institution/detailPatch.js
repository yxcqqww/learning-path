/*
 1. 项目名称：m.360guanai.com
 2. 页面名称：服务详情页(M站)
 3. 作者：songlindan
*/

function MzDetailController(){
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     服务详情的图文混排
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxFill();
    
};


MzDetailController.prototype.ajaxFill = function(){
    var classSelf = this;

    var liLength = $('.tp-nav-box ul li').length;   //导航列表的长度
    var navHight = $('.tp-all').offset().top;    //距离浏览器顶部的高度
    $(window).scroll(function(event) {
        var scrollHight = $(this).scrollTop();  //被浏览器卷曲的高度
        if (scrollHight>=navHight) {
            $('.tp-nav-box').addClass('tp-nav-box-in');
        }else{
            $('.tp-nav-box').removeClass('tp-nav-box-in');
        }
    });
    //点击导航
    var liLength = $('.tp-nav-box ul li').length;   //导航列表的长度
    for (var i = 0; i < liLength; i++) {
        $('.tp-nav-box ul li').eq(i).click(function(event) {
            //样式的改变
            $('.tp-nav-box ul li a').removeClass('in');
            $(this).children('a').addClass('in');
            var liIndex = $(this).children('a').attr('nav-index');  //列表的长度 
            var scrollHg = $('.box_'+liIndex+'').offset().top;  //每个list对应内容的盒子距离浏览器顶部的高度
            $('html,body').stop().animate({'scrollTop':scrollHg+'px'},500);
        })
    }   
}


$(function() {
    new MzDetailController;
});


