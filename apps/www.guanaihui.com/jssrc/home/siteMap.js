/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：siteMap(二级优惠页)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

 function SiteMapController()
 {
 	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory() ;

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化机构二级类目左右显示
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.showItems() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();

 }

 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化机构二级类目左右显示
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 SiteMapController.prototype.showItems=function(){
 	var $container=$('.itemContainer');
 	var $rightDiv=$("<div class='content pull-right'></div>");
 	
 	$container.find('.item').each(function(index, el) {
 		if ((index+1)%2==0) {
 			$rightDiv.append($(el));
 		}
 	});

 	$container.append($rightDiv);
 }
/*top栏获取一些东西*/
SiteMapController.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}
 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new SiteMapController;
});