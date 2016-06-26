/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 插件名称：thumbnail
 2. 插件描述：缩略图
 3. 版本：1.0
 4.  对其他插件的依赖：无
 5. 作者：zhaohuagang@guanaihui.com
 6. 未尽事宜：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
(function($) {
    $.fn.thumbnail = function(options) {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        将每个thumbnail加上对应的配置属性
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var opts = $.extend({}, $.fn.thumbnail.defaults, options);
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         执行事件添加后返回
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        return this.each(function() {            
            $.fn.thumbnail.appendTools(this, opts) ;           
            $(this).on("mouseover.thumbnail", function(){                
                $(this).find(".tools").show() ;
            }) ;
            $(this).on("mouseout.thumbnail", function(){
                $(this).find(".tools").hide() ;
            }) ;            
        }) ;
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     定义切换到某一帧的方法
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $.fn.thumbnail.appendTools = function(container, opts) {
        var $remove = $(document.createElement("A")).attr("href", "javascript:void(0);").addClass('iconfont icon-shanchu').attr("data-toggle", "tooltip").attr("data-placement", opts.tooltipPlacement).attr("title", "删除该图片") ;
        $remove.on("click.thumbnail", function(){
            opts.onDelete($(container).find("img").attr("data-id")) ;
        }) ;
        var $prev = $(document.createElement("A")).attr("href", "javascript:void(0);").addClass('iconfont icon-xiangzuo3').attr("data-toggle", "tooltip").attr("data-placement", opts.tooltipPlacement).attr("title", "顺序往前排一位") ;
        $prev.on("click.thumbnail", function(){
            if($(container).prev().size() === 0) return ;
            $(container).insertBefore($(container).prev()) ;
        }) ;        
        var $next = $(document.createElement("A")).attr("href", "javascript:void(0);").addClass('iconfont icon-xiangyou4').attr("data-toggle", "tooltip").attr("data-placement", opts.tooltipPlacement).attr("title", "顺序向后移一位") ;
        $next.on("click.thumbnail", function(){
            if($(container).next().size() ===0) return ;
            $(container).insertAfter($(container).next()) ;
        }) ;
        var $checked = $(document.createElement("A")).attr("href", "javascript:void(0);").addClass('iconfont icon-zhengque1').attr("data-toggle", "tooltip").attr("data-placement", opts.tooltipPlacement).attr("title", "选中/取消选中该图片") ;
        $checked.on("click.thumbnail", function(){
            $(container).find(".handle").toggle(100) ;
        }) ;
        var $handle = $(document.createElement("i")).addClass('icon-18 icon-18-checked handle') ;
        $handle.on("click.thumbnail", function(){
            $(this).toggle() ;
        }) ;
        $(container).append($(document.createElement("DIV")).addClass("tools").append($remove).append($prev).append($next).append($checked)) ;
        $(container).append($handle) ;
        $(container).find("[data-toggle='tooltip']").tooltip() ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     thumbnail默认配置
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $.fn.thumbnail.defaults = {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         句柄容器的class名称
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        tooltipPlacement : "top" ,
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        删除图片接口方法，以data-id属性的值当做参数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        onDelete : null
    } ;
})(jQuery);