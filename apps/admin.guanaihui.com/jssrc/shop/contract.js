/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：shop/contract(商户->合同编辑面板)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ContractController(params) {
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
    初始化自定义checkbox
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceMyCheck() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    日历的初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initCalendar() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化dialog
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceDialog() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    事件绑定
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    保存合同处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.save() ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
事件绑定
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.bind = function() {
    var classSelf = this ;
    $(this.quickPanel).find(".tools .cancel").click(function(){
        classSelf.close() ;
    }) ;    
    $(this.quickPanel).find("select[name='contractType']").change(function(){   
        classSelf.changeTrafficCount() ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化自定义checkbox
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.instanceMyCheck = function() {
    var $myChecks = $(this.quickPanel).find(".gift .my-check") ;
    var classSelf = this ;
    $myChecks.click(function(){
        $myChecks.removeClass("icon-18-radio-checked").addClass("icon-18-radio-unchecked") ;
        $(this).addClass("icon-18-radio-checked").removeClass("icon-18-radio-unchecked") ;
        $(classSelf.quickPanel).find(".gift input[name='bannerType']").val($(this).attr("data-value")) ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
关闭面板
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.close = function() {
    $(this.quickPanel).slideUp(200) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
根据checkbox状态决定选项是否显示
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.initOptional = function() {
    $(this.quickPanel).find(".gift").each(function(){
        var method = $(this).find(":checked").size() === 0 ? "hide" : "show" ;
        eval("$(this).find('.optional')." + method + "(100);") ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化日历
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.initCalendar = function() {
    var classSelf = this ;
    require([
        //this.parentClass.bootstrapStaticPrefix + "/plugins/datetimepicker/js/bootstrap-datetimepicker.js" ,
        this.parentClass.bootstrapStaticPrefix + "/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"
    ], function(){
        $.fn.datetimepicker.defaults.language = 'zh-CN' ;
        $(classSelf.quickPanel).find(".content input[name='signOn']").datetimepicker({
            format: 'yyyy-mm-dd',
            language:  'zh-CN',
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        }).on('changeDate', function(ev){

        });
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化bootstrap-switch
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.instanceSwitch = function() {  
    var classSelf = this ;
    require([this.parentClass.bootstrapStaticPrefix + "/plugins/bootstrap-switch/dist/js/bootstrap-switch.min.js"], function(){
        $(classSelf.quickPanel).find(".gift").each(function(){
            var $gift = $(this) ;
            var $handle = $gift.find("input[type='checkbox']") ;        
            $handle.bootstrapSwitch({
                "size" : "small" ,
                "onText" : "是" ,
                "offText" : "否"
            }) ;
            $handle.on('switchChange.bootstrapSwitch', function(event, state) {
                if(state) $gift.find(".optional").show(100) ;
                else $gift.find(".optional").hide(100) ;
                var handleId = $handle.attr("id") ;
                //var state = state ? 1 : 0 ;
                if(handleId === "trafficFlagHandle") {
                    $gift.find("input[name='trafficFlag']").val(state) ;
                    if( ! state) $gift.find("input[name='trafficCount']").val("") ;
                    classSelf.changeTrafficCount() ;
                }
                else if(handleId === "bannerFlagHandle") {
                    $gift.find("input[name='bannerFlag']").val(state) ;
                    if( ! state) $gift.find("input[name='bannerType']").val("") ;
                    if( ! state) $gift.find(".my-check").removeClass("icon-18-radio-checked").addClass("icon-18-radio-unchecked") ;
                }
            }) ;
        }) ;            
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化dialog
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.instanceDialog = function() {
    var classSelf = this ;
    $(this.quickPanel).find(".dialog-handle").click(function(){
        var id = $(this).attr("data-dialog-id") ;
        classSelf.parentClass.dialog({ 
            "id" : id , 
            "url" : $(this).attr("data-href") ,
            "dimension" : "lg"
        }) ; 
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        dialog实例化后要实例化用户选择界面
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $("#" + id).on("loaded.bs.modal", function (e) {           
            require([classSelf.parentClass.appStaticPrefix + "/public/select-users.min.js"], function(){
                new SelectUsersController({
                    usersPanel : $("#" + id) ,
                    parentClass : classSelf.parentClass ,
                    maximum : 1 ,
                    onSelected : function(userIds, userNames){
                        $(classSelf.quickPanel).find("input[name='bdNames']").val(userNames) ;
                        $(classSelf.quickPanel).find("input[name='bdId']").val(userIds) ;
                        $("#" + id).modal("hide") ;
                    }
                }) ;
            }) ;
              
        }) ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
保存合同处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.save = function() {
    var classSelf = this ;    
    require([this.parentClass.utilStaticPrefix + "/jquery.asyncsubmit.min.js"], function(){
        $(classSelf.quickPanel).asyncsubmit({            
            utilStaticPrefix : classSelf.parentClass.utilStaticPrefix ,
            dataType : classSelf.parentClass.apiDataType ,
            onSavingInterface : function() {
                classSelf.parentClass.tips("正在进行处理，请稍等...") ;                   
            } ,
            onErrorInterface : function() {
                classSelf.parentClass.tips("请求失败，请检查您的接口！", 2) ;                    
            } ,
            onSuccessInterface : function(result) {
                classSelf.parentClass.tips("合同保存成功！", 2, function(){
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
根据签约项目以及是否赠送引流来决定赠送引流次数，原则如下：
1. 如果是关爱宝黄金会员，如果赠送引流，就是20次，不能更改
2. 如果是关爱宝铂金会员，如果赠送引流，就是50次，不能更改
3. 如果是关爱宝钻石会员，如果赠送引流，就是100次，不能更改
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ContractController.prototype.changeTrafficCount = function(){
    var contractType = $(this.quickPanel).find("select[name='contractType']").val() ;
    var trafficFlag = $(this.quickPanel).find("input[name='trafficFlag']").val() ;
    var trafficCount = 0 ;
    if(contractType !== "" && trafficFlag !== "false" && trafficFlag !== "") {
        if(contractType === "0") trafficCount = 20 ;
        else if(contractType === "1") trafficCount = 50 ;
        else if(contractType === "2") trafficCount = 100 ;
    }
    $(this.quickPanel).find("input[name='trafficCount']").val(trafficCount) ;
} ;
