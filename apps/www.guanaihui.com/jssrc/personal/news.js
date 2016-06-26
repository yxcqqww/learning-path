/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：news(个人中心-个人消息)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function News() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory(); 
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化点击事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.addListenerToListItem();

    this.inpclickListener();

    this.newsdelete();
    this.ajaxSet();
};
/*top栏获取一些东西*/
News.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 初始化点击事件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
News.prototype.addListenerToListItem = function() {
    var _co = this;
    $("body").on("click", ".news-list dl:not(.readed,.stop-event)", function() {
        var _this = $(this);
        _this.addClass("stop-event");
        var data = {
            "id": _this.find("#notificationId").val()
        };
        var param = {
            type: "POST",
            // 成功调用预约接口回掉
            process: function(result) {
                if (!_this.hasClass('readed')) {
                    _this.addClass("readed").find("dt i").removeClass('icon-bg-unreadMsg').addClass('icon-bg-readedMsg');
                }
                if (result.result <= 0) {
                    $("#notifFlag") ? $("#notifFlag").remove() : null;
                }
                _this.removeClass("stop-event");
            },
            onExceptionInterface: function(code, messgae) {
                _this.removeClass("stop-event");
            }
        };
        _co.request(_co.apiPrefix + "personal/news/read.do", data, param);

    });
}



News.prototype.inpclickListener=function(){
    var self=this;
    $('.title p input').click(function(event) {
        event.stopPropagation();
        var _this=$(this);
        if (_this.is(":checked")) {
            $(".news input:checkbox").prop("checked",true);
        }
        else{
            $(".news input:checkbox").removeAttr('checked');
        }
        if($('.news-list dl').length==0){
            for(var i=0;i<$('.title p input').length;i++){
             $('.title p input').eq(i).css('disabled','true');
            }
        }

    });
    $('.inpwrap input').click(function(event) {
        event.stopPropagation();
    });
    
};
/*信息删除事件*/
News.prototype.newsdelete=function(){
    var classSelf=this;
    if($('.news-list dl').length==0){
       $('.title p input').attr('disabled','true');
       $('.deall').remove();
    }
    var $this;
    $('.titlebot .deall').click(function(event) {
        var selArr=[];
        for(var i=0;i<$('.news-list dl').length;i++){
            var _inpThis=$('.news-list dl').eq(i).find('input:checkbox');
            if(_inpThis.prop('checked')){
                selArr.push(_inpThis);
            }
        }
        if(selArr.length!=0){
            $this=$(this);
            $('.pop-cover,.popUp-delete').show();
        }
    });
    $('.delete span').click(function(event) {
        if($('.news-list dl').length==0){
            classSelf.tips('抱歉，系统忙，请联系客服！');
        }else{
            event.stopPropagation();
            $this=$(this);
            $('.pop-cover,.popUp-delete').show();
        }
        
    });
    $('.popUp-delete button.closer').click(function(event) {
        $('.pop-cover,.popUp-delete').hide();
    });

    $('.popUp-delete i').click(function(event) {
         $('.pop-cover,.popUp-delete').hide();
    });

    $('.popUp-delete').find('.ensure').on('click', function() {
        if($this.attr('class')=='deall'){
            var $chk = $('.news-list').find('input[type="checkbox"]'),
                $dls = $('.news-list').find('dl'),
                arr = [],
                dom = [];

            $.each($chk, function(index, elem) {
                if (elem.checked) {
                    arr.push(Number(elem.id));
                    dom.push($(elem).closest('dl')[0]);
                }
            });
            classSelf.request(classSelf.personnalDuoNewsUrl, {id: arr.join(',')}, {
                process: function() {
                    $.each(dom, function(index, item) {
                        $(item).remove();
                    });
                    $('.pop-cover,.popUp-delete').hide();
                    var url = window.location.href.split('?');
                    window.location.href = url[0];
                }
            });
        }else{
            var id=$this.attr('data-id');
            classSelf.request(classSelf.personnalNewsUrl,{
                "id":id
            },{
                process:function(data){
                    $('.pop-cover,.popUp-delete').hide();
                    $this.parents('dl').remove();
                    location.reload();
                    if($('.news-list dl').length==0){
                       $('.title p input').attr('disabled','true');
                    }
                }
            });
        }

    });  
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new News;
});
