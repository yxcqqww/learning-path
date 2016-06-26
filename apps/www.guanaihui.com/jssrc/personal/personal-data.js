/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：index(个人中心)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function PersonalDataController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面顶部全部服务分类下拉
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();

};
/*top栏获取一些东西*/
PersonalDataController.prototype.ajaxSet=function(){
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
    new PersonalDataController;
});
