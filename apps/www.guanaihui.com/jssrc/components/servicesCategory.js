/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：components - > servicesCategory(页面组件 -> 服务类别)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ServicesCategory(params) {
    this.mode = (params === null || params.mode === null || params.mode === undefined) ? "hover" : params.mode ;  //下拉出菜单的模式，hover | auto ，默认为悬停下拉，如果是auto，就表示像首页这样，固定显示在页面中
    if(this.mode === "hover") this.drop();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     鼠标悬停在分类上，内容的切换
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     "全部服务分类"鼠标悬停下拉出菜单
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.keepVisible();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
"全部服务分类"鼠标悬停下拉出菜单
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.drop= function() {
    $(".navigator-bar .container dt").mouseover(function(){
        $(".services-list").css({ "visibility" : "visible" }) ;
    });
    $(".navigator-bar .container dt").mouseout(function(){
        $(".services-list").css({ "visibility" : "hidden" }) ;
    });  
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
鼠标悬停在分类上，内容的切换
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.swapCategory = function() {   
   var classSelf = this ;
    $(".services-list li").each(function(index, element){
        $(element).mouseover(function(){
            if($(this).find(".icon-26").length>=1){  
                $(".services-list li").removeClass("on") ;
                $(this).addClass("on");
                $(".services-list-children").css({ "visibility" : "visible" }).height($(".services-list").height()) ;
                $(".services-list-children .tabs-frame").hide();
                $(".services-list-children .tabs-frame").eq(index).show() ;
            } ;
        }) ;
        $(element).mouseout(function(){
            if($(this).find(".icon-26").length>=1){
               $(this).removeClass("on") ;
               $(".services-list-children").css({ "visibility" : "hidden" }) ;
            }else{
              $(".services-list-children").css({ "visibility" : "hidden" });
            };
        }) ;
   }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
鼠标悬停到子菜单容器上，相应第一级菜单不能隐藏，还要让相应一级菜单保持鼠标压在上面状态
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.keepVisible = function() {
    var classSelf = this;
    $(".services-list-children").mouseover(function(){
        $(this).css("visibility" , "visible" ) ;
        $(".services-list").css( "visibility" , "visible" ) ;
        var hoverIndex = null ;
        $(this).find(".tabs-frame").each(function(index, element){
            if($(this).is(":visible")) hoverIndex = index ;
        }) ;
        $(".services-list li").eq(hoverIndex).trigger("mouseover") ;
    }) ;
    $(".services-list-children").mouseout(function(){
        $(this).css({ "visibility" : "hidden" }) ;
        if(classSelf.mode === "hover") $(".services-list").css({ "visibility" : "hidden" }) ;
         $(".services-list li").removeClass('on');  
    }) ;
} ;

