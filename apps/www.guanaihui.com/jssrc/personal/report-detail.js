/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：ReportDetail(个人中心-报告详情)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ReportDetailController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面查看详细，modal显示大图
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.showlLgImg();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();

};
/*top栏获取一些东西*/
ReportDetailController.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 页面查看详细，modal显示大图
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ReportDetailController.prototype.showlLgImg = function() {
    var classSelf = this;
    if ($(".img-list-box > a").size() === 0) return;
    require([classSelf.utilStaticPrefix + "/jquery.slide.min.js"], function() {
        $(".img-list-box > a").off("click").on("click", function() {

			// 恢复位置
			var imgs = "";
			$(".img-list-box img").each(function(i,item){
				imgs += "<div class='item'><img src='" + $(item).attr("src") + "'/></div>";		   
			});
			
			$(".report-list-imgs .content").html(imgs);
            // 调换位置
            var url = $(this).find("img").attr("src");
            var $prevAll = $(".report-list-imgs img[src='" + url + "']").parent().prevAll(".item");
            if ($prevAll.length > 0) {
				var $lastInsertItem = null;
				$prevAll.each(function(i,item){
					$lastInsertItem ? $(item).insertBefore($lastInsertItem):$(".report-list-imgs .content").append($(item));
					$lastInsertItem = $(item);
				});
                
                //$prevAll.remove();
            }
            // 重新创建图片列表
            if ($(".report-list-imgs .tempWrap").length > 0) {
                var imgs = $(".report-list-imgs .content").html();
                $(".report-list-imgs .tempWrap").remove();
                var newImgList = document.createElement("div");
                $(newImgList).addClass("content");
                $(newImgList).html(imgs);
                $(newImgList).find(".item").removeAttr("style");
                $(".report-list-imgs").append($(newImgList));
            }
            var listImgsHtml = $(".report-list-imgs").html();
            var newListImgs = document.createElement("div");
            $(newListImgs).html(listImgsHtml);
            $(newListImgs).addClass("report-list-imgs");
            $(".report-list-imgs").remove();
            $("#ModalImg .modal-body").append($(newListImgs));

            // 显示modal并初始化滚动
            $("#ModalImg").modal("show");
            $('#ModalImg').one('shown.bs.modal', function(e) {
                $(".report-list-imgs").slide({
                    autoPlay: false,
                    effect: "leftLoop",
                    interTime: 4000,
                    vis: 1
                });
            })
        });
    });

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ReportDetailController;
});
