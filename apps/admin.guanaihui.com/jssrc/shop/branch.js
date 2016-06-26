/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：shop/branch(商户->门店编辑面板)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function BranchController(params) {
    this.quickPanel = params.quickPanel ;
    this.parentClass = params.parentClass ;       
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化bootstrap-switch
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/            
    this.instanceSwitch() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    可选项的初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initOptional() ; 
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化省市区联动插件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceCascade() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    日历的初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initCalendar() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    事件绑定
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    保存门店处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.save() ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
事件绑定
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.bind = function() {
    var classSelf = this ;
    $(this.quickPanel).find(".tools .cancel").click(function(){
        classSelf.close() ;
    }) ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
关闭面板
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.close = function() {
    $(this.quickPanel).slideUp(200) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
根据checkbox状态决定选项是否显示
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.initOptional = function() {
    $(this.quickPanel).find(".switcher").each(function(){
        var method = $(this).find(":checked").size() === 0 ? "hide" : "show" ;
        eval("$(this).find('.optional')." + method + "(100);") ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化bootstrap-switch
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.instanceSwitch = function() {  
    var classSelf = this ;
    require([this.parentClass.bootstrapStaticPrefix + "/plugins/bootstrap-switch/dist/js/bootstrap-switch.min.js"], function(){
        $(classSelf.quickPanel).find(".switcher").each(function(){
            var $switcher = $(this) ;
            var $handle = $switcher.find("input[type='checkbox']") ;        
            $handle.bootstrapSwitch({
                "size" : "small" ,
                "onText" : "是" ,
                "offText" : "否"
            }) ;
            $handle.on('switchChange.bootstrapSwitch', function(event, state) {
                if(state) $switcher.find(".optional").show(100) ;
                else $switcher.find(".optional").hide(100) ;
                $switcher.find("input[type='hidden']").val(state) ;
            }) ;
        }) ;            
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化省市区联动插件并给地区选择框增加验证属性
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.instanceCascade = function() {  
    var classSelf = this ;     
    require([this.parentClass.utilStaticPrefix + "/cascadeSelect/jquery.cascadeselect.min.js"], function(){
        var areaId = $(classSelf.quickPanel).find("input[name='areaId']").val() ;
        var defaultVals = new Array ;
        if(areaId) areaId = $.trim(areaId) ;
        if(areaId) defaultVals = areaId.split(",") ;
        $(classSelf.quickPanel).find(".cascade").cascadeSelect({
            url : classSelf.parentClass.utilStaticPrefix + "/cascadeSelect/data.json",
            crossDomain : true ,
            nameAttrs : ["province","city","district"] ,
            defaultVals : defaultVals ,
            classAttrs : ["form-control input-sm", "form-control input-sm", "form-control input-sm"] ,
            onInitInterface : function(){
                $(classSelf.quickPanel).find(".cascade select[name='district']").attr("data-validation-engine", "validate[required]") ;
            }
        }) ;        
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化日历
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.initCalendar = function() {    
    var classSelf = this ;
    require([
        //this.parentClass.bootstrapStaticPrefix + "/plugins/datetimepicker/js/bootstrap-datetimepicker.js" ,
        this.parentClass.bootstrapStaticPrefix + "/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"
    ], function(){
        $.fn.datetimepicker.defaults.language = 'zh-CN' ;        
        $(classSelf.quickPanel).find("input[name='openingTime'],input[name='closingTime']").datetimepicker({
            format : "hh:ii" ,
            language :  "zh-CN" ,
            weekStart : 1 ,
            autoclose : 1 ,
            minuteStep : 15 ,
            startView : 1 ,
            maxView : 0 ,
            minView : 0 ,
            forceParse: 0
        }).on('changeDate', function(ev){

        });
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 保存门店处理
如何知道是新增还是修改？看quickPanel的data-operation属性的值，可以是：add|edit
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
BranchController.prototype.save = function() {
    var classSelf = this ;   
    require([this.parentClass.utilStaticPrefix + "/jquery.asyncsubmit.min.js"], function(){    
        $(classSelf.quickPanel).asyncsubmit({            
            utilStaticPrefix : classSelf.parentClass.utilStaticPrefix ,
            dataType : classSelf.parentClass.apiDataType ,
            beforeSaveInterface : function(){
                /*
                var openingTime = $(classSelf.quickPanel).find("input[name='openingTime']").val() ;
                alert(openingTime) ;
                var closingTime = $(classSelf.quickPanel).find("input[name='closingTime']").val() ;
                if(closingTime === openingTime) {
                    classSelf.parentClass.tips("营业结束时间不能和开始时间相同！", 2) ;
                    return false ;
                }
                return true ;
                */
            } ,
            onSavingInterface : function() {
                classSelf.parentClass.tips("正在进行处理，请稍等...", 2) ;                   
            } ,
            onErrorInterface : function() {
                classSelf.parentClass.tips("请求失败，请检查您的接口！", 2) ;                    
            } ,
            onSuccessInterface : function(result) {
                classSelf.parentClass.tips("门店保存成功！", 2, function(){
                    window.location.reload() ;
                }) ;
            } ,
            onExceptionInterface : function(message) {                     
                classSelf.parentClass.tips("<span class=\"text-danger\">" + message + "</span>", 5) ;
            }
        }) ;
    }) ;
} ;