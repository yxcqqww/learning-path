/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：shop/brand(商户->机构编辑面板)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function BrandController(params) {
    this.brandPanel = params.brandPanel ;
    this.parentClass = params.parentClass ;    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化省市区联动插件
    
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceCascade() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    从tagIds这两个隐藏域里面去分析，哪些select的选项是要被selected的，而且这个任务一定要在this.instanceSelect2() ;任务前执行
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initSelectOptions() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化select2
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceSelect2() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    保存机构信息处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.save() ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化省市区联动插件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BrandController.prototype.instanceCascade = function() {  
    var classSelf = this ;     
    require([this.parentClass.utilStaticPrefix + "/cascadeSelect/jquery.cascadeselect.min.js"], function(){
        var locationDeafultVals = new Array ;
        var areaId = $(classSelf.brandPanel).find("input[name='areaId']").val() ;
        if(areaId) areaId = $.trim(areaId) ;
        if(areaId) locationDeafultVals = areaId.split(",") ;
        $(classSelf.brandPanel).find(".location-linkage").cascadeSelect({
            url : classSelf.parentClass.utilStaticPrefix + "/cascadeSelect/data.json",
            crossDomain : true ,
            nameAttrs : ["province","city","district"] ,
            classAttrs : ["form-control input-sm", "form-control input-sm", "form-control input-sm"] ,
            defaultVals : locationDeafultVals ,
            onInitInterface : function(){
                $(classSelf.brandPanel).find(".location-linkage select[name='district']").attr("data-validation-engine", "validate[required]") ;
            }
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        一二级分类联动，根据页面上isTjt这个id的隐藏域的值来决定是否只加载体检机构
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var categoryApiUrl = ($("#isTjt").val() === "true") ? classSelf.parentClass.apiUrl.shop.categories.tjtList : classSelf.parentClass.apiUrl.shop.categories.list ;
        var categoryDefaultVals = new Array ;
        var categoryId = $(classSelf.brandPanel).find("input[name='categoryId']").val() ;
        if(categoryId) categoryId = $.trim(categoryId) ;
        if(categoryId) categoryDefaultVals = categoryId.split(",") ;
        $(classSelf.brandPanel).find(".category-path").cascadeSelect({
            level : 2 ,
            url : categoryApiUrl ,
            crossDomain : true ,
            jsonpCallback : "getCategory" ,
            nameAttrs : ["primary","secondary"] ,
            classAttrs : ["form-control input-sm", "form-control input-sm"] ,
            defaultVals : categoryDefaultVals ,
            dataKey : "cateGoryList"  ,            
            onInitInterface : function(){
                $(classSelf.brandPanel).find(".category-path select[name='secondary']").attr("data-validation-engine", "validate[required]") ;
            }
        }) ;           
        
    }) ;
} ;

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化select2
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BrandController.prototype.instanceSelect2 = function(content) {  
   $(this.brandPanel).find("select[name='tags']").select2({
       "placeholder" : "请选择" ,
       "width" : "100%"
   }) ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 保存机构信息处理
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BrandController.prototype.save = function() {
    var classSelf = this ;    
    require([this.parentClass.utilStaticPrefix + "/jquery.asyncsubmit.min.js"], function(){
        $(classSelf.brandPanel).find("form").asyncsubmit({            
            utilStaticPrefix : classSelf.parentClass.utilStaticPrefix ,
            dataType : classSelf.parentClass.apiDataType,
            onSavingInterface : function() {
                classSelf.parentClass.tips("正在进行处理，请稍等...") ;                   
            } ,
            onErrorInterface : function() {
                classSelf.parentClass.tips("请求失败，请检查您的接口！", 2) ;                    
            } ,
            onSuccessInterface : function(result) {
                
                classSelf.parentClass.tips("机构信息保存成功！", 2, function(){
                    window.location.reload() ;
                }) ;
            } ,
            onExceptionInterface : function(message) {                     
                classSelf.parentClass.tips("<span class=\"text-danger\">" + message + "</span>", 5) ;
            }
        }) ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
从shopIds和productTagIds这两个隐藏域里面去分析，哪些select的选项是要被selected的
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BrandController.prototype.initSelectOptions = function() {
    var tagIds = $(this.brandPanel).find("input[name='tagIds']").val() ;
    var selectedTagsArray = new Array ;
    if(tagIds) selectedTagsArray = tagIds.split(",") ;
    $(this.brandPanel).find("select[name='tags'] option").each(function(){
        if($.inArray($(this).attr("value"), selectedTagsArray) !== -1) $(this).attr("selected", "selected") ;
    }) ;
} ;