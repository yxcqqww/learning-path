/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.guanaihui.com
 2. 页面名称：Controller (每个页面的类都继承于这个控制器基类)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：对api的依赖：jQuery
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Controller() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    静态资源域名序列随机化，为什么要定义在上面，因为在后面定义的话前面用这个方法取不到
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.randomDomainSn = function() {
        var sn = parseInt(Math.random() * 10 + 1, 10).toString();
        if (sn.length < 2) sn = "0" + sn ;
        return sn ;
    } ; 
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    对环境的定义：
    @development : 开发环境，对应静态资源域名为：dev01.guanaihui.cn - source20.guanaihui.cn
    @test：测试环境，对应静态资源域名为：stage01.guanaihui.cn - stage20.guanaihui.cn
    @production ：生产环境，对应静态资源域名为：cdn01.guanaihui.com - cdn20.guanaihui.com
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.environment = "dev"; //环境定义
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    域名前后缀
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.domainSuffix = (this.environment === "production") ? "com" : "cn" ;
    this.staticDomainPrefix = "dev" ;
    if (this.environment === "test") this.staticDomainPrefix = "stage" ;
    else if (this.environment === "production") this.staticDomainPrefix = "cdn" ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    一些关于cookie参数的配置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.cookieDomain = ".guanaihui." + this.domainSuffix ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    根据环境决定static资源域名前缀
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/    
    this.staticDomain = "//" + this.staticDomainPrefix  + this.randomDomainSn() + ".guanaihui." + this.domainSuffix ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    工具库路径及应用的控制器路径
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.utilStaticPrefix = this.staticDomain + "/guanaihui/js/util";
    //this.appStaticPrefix = this.staticDomain + "/apps/m.guanaihui.com/js";



    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Native 跳转BaseUrl
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.nativeRedirectUrl="gah://js.native/";

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    一些关于dialog | tips | confirm 参数的配置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.tipsDialogId = "guanaihui-tips"; //整个应用通用的tips框的id值
    this.confirmDialogId = "guanaihui-confirm"; //整个应用通用的confirm框的id值
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    整个应用Ajax请求的时候的数据类型，是json还是jsonp，生产环境用json，其他环境用jsonp
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiDataType = (this.environment === "development") ? "jsonp" : "json";

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    api接口地址前缀
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    
    if (this.environment === "dev") {
        this.mPrefix = "http://devweb.guanaihui.cn";
    }else if(this.environment === "test") {
        this.mPrefix = "http://testweb.guanaihui.cn";
    }else if(this.environment === "production"){
        this.mPrefix = "http://www.guanaihui.com";
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    接口的地址，把整个应用的所有接口地址写在这里，方便统一维护
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiPrefix = (this.environment === "development") ? "" : "/"    //api接口地址前缀

    this.companyUrl = this.mPrefix + this.apiPrefix +"mobile/company/detail/";    //机构主页
    this.listFromShopUrl = this.mPrefix + this.apiPrefix +"mobile/product/listFromShop/";    //预约服务 
    this.detailUrl = this.mPrefix + this.apiPrefix +"mobile/product/detail/";    //服务详情页   
    this.companyImageTextUrl = this.mPrefix + this.apiPrefix +"/m/company/imageText/"; //机构主页图文混排




    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    新增模态框的公共方法，是下面的this.dialog和this.tips两个方法的基础方法
    1. 使用方法：
        this.createModalDialog({
            "type" : "dialog" ,  //模态框类型，值为：dialog | tips | confirm
            "id" : "my-modal-dialog" ,  //模态框ID值
            "effect" : true ,  //弹出dialog的时候是否需要fade效果
            "tabindex" : 1  //模态框的tabindex值
        }) ;
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.createModalDialog = function(params) {
        var type = (params === null || params.type === null || params.type === undefined) ? "dialog" : params.type ;
        var effect = (params === null || params.effect === null || params.effect === undefined) ? true : params.effect ;
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex;        
        var id = params.id;
        if (type === "tips") id = this.tipsDialogId;
        else if (type === "confirm") id = this.confirmDialogId;        
        var modal = $(document.createElement("DIV")).attr("id", id).attr("role", "dialog").attr("aria-labelledby", "myModalLabel").addClass("modal");
        if(effect) $(modal).addClass("fade") ;
        if (tabindex) $(modal).attr("tabindex", tabindex) ;
        var modalDialog = $(document.createElement("DIV")).attr("role", "document").addClass("modal-dialog").append($(document.createElement("DIV")).addClass("modal-content")) ;
        $(modal).append(modalDialog) ;
        $("body").prepend(modal) ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    弹出普通的内容为某个url的html结构的模态框，始终都是先干掉先前如果存在的同样ID的模态框再新增
    备注：这个方法只能打开同域名下的页面
    使用方法：
    this.dialog({
        "id" : id ,
        "url" : url ,
        "tabindex" : tabindex        
    }) ;
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.dialog = function(params) {
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex ;        
        if ($("#" + params.id).size() > 0) $("#" + params.id).remove();
        this.createModalDialog({
            "type": "dialog",
            "id": params.id,
            "tabindex": tabindex
        });
        $("#" + params.id).modal({
            remote: params.url
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        让dialog在纵向居中
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $("#" + params.id).on("shown.bs.modal", function(){
            var $modalDialog = $(this).find(".modal-dialog") ;
            var dialogHeight = $modalDialog.height() ;
            var dialogWidth = $modalDialog.width() ;
            if ($(window).height() < dialogHeight) return ;
            $modalDialog.css({
                "position" : "absolute",
                "top" : "50%",
                "left" : "50%",
                "margin-left" : - ( dialogWidth / 2 ),
                "margin-top" : - ( dialogHeight / 2 )
            });
        }) ;
        $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    弹出tips提示框，参数：
    @content：提示的html信息
    @time：表示多少秒之后关闭，如果为0表示不关闭，单位为秒
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.tips = function(content, time, callback) {
        var classSelf = this;
        if ($("#" + this.tipsDialogId).size() > 0) {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            如果提示框html结构已经存在，就改变内容再显示
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $("#" + this.tipsDialogId + " .modal-tips").html(content);
            $("#" + this.tipsDialogId).modal("show");
        } else {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            如果先前页面都没有提示过就先创建模态框
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            this.createModalDialog({
                "type": "tips"
            });
            $("#" + this.tipsDialogId).addClass("bs-example-modal-sm");
            $("#" + this.tipsDialogId + " .modal-dialog").addClass("modal-sm");
            $("#" + this.tipsDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-tips").html(content));
            $("#" + this.tipsDialogId).modal({
                "keyboard": true
            });
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        最后根据需要决定是否关闭
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (time) {
            window.setTimeout(function() {
                $("#" + classSelf.tipsDialogId).modal("hide");
                if (callback) callback();
            }, time * 1000);
        }
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    确认框
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.confirm = function(params) {
        var classSelf = this;
        var title = (params === null || params.title === null || params.title === undefined) ? "系统确认" : params.title;
        var content = (params === null || params.content === null || params.content === undefined) ? "" : params.content;
        var showConfirmBtn = (params === null || params.showConfirmBtn === null || params.showConfirmBtn === undefined) ? true : params.showConfirmBtn;
        var confirmLabel = (params === null || params.confirmLabel === null || params.confirmLabel === undefined) ? "确认" : params.confirmLabel;
        var showCancelBtn = (params === null || params.showCancelBtn === null || params.showCancelBtn === undefined) ? true : params.showCancelBtn;
        var cancelLabel = (params === null || params.cancelLabel === null || params.cancelLabel === undefined) ? "取消" : params.cancelLabel;
        var confirmInterface = (params === null || params.confirmInterface === null || params.confirmInterface === undefined) ? null : params.confirmInterface;
        var cancelInterface = (params === null || params.cancelInterface === null || params.cancelInterface === undefined) ? null : params.cancelInterface;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        如果先前有这个dialog就删除
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if ($("#" + this.confirmDialogId).size() > 0) $("#" + this.confirmDialogId).remove();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        先创建一个dialog
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.createModalDialog({
            "type": "confirm"
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        再将节点贴进去
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $("#" + this.confirmDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-header").append("<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">" + title + "</h4>"));
        $("#" + this.confirmDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-confirm").html(content));
        var confirmFooter = $(document.createElement("DIV")).addClass("modal-footer");
        if (showConfirmBtn) {
            var confirmBtn = $(document.createElement("BUTTON")).attr("type", "button").addClass("btn btn-primary btn-sm").text(confirmLabel);
            $(confirmBtn).click(function() {
                if (confirmInterface) confirmInterface();
                $("#" + classSelf.confirmDialogId).modal("hide");
            });
            $(confirmFooter).append(confirmBtn);
        }
        if (showCancelBtn) {
            var cancelBtn = $(document.createElement("BUTTON")).attr("type", "button").addClass("btn btn-default btn-sm").attr("data-dismiss", "modal").text(cancelLabel);
            $(cancelBtn).click(function() {
                if (cancelInterface) cancelInterface();
            });
            $(confirmFooter).append(cancelBtn);
        }
        $("#" + this.confirmDialogId + " .modal-content").append(confirmFooter);
        $("#" + this.confirmDialogId).modal({
            "keyboard": true
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送Ajax请求的方法：
    @apiUrl：请求的url地址
    @data：请求附带发送的参数数据
    @params：{
        @type：请求的类型，可以是：GET|POST，但是如果apiDataType参数指为jsonp的话，这里设置为POST有没有任何意义，因为jsonp只能是GET
        @apiDataType：接口数据类型，可以是：json|jsonp|script等
        @showLoadingTips：加载过程中是否显示提示信息，可以为null，默认显示，如果要关闭，请设置值为 false
        @loadingTips：加载过程中显示的提示信息内容，默认为："正在加载数据，请稍等..."
        @process：code==200的时候的回调接口方法
        @onExceptionInterface：发生错误的时候的回调接口方法
    }    
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.request = function(apiUrl, data, params) {
        var classSelf = this;
        var type = (params === null || params.type === null || params.type === undefined) ? "GET" : params.type;
        if (this.environment !== "production") type = "GET"; //只要是jsonp请求，type肯定为GET
        var process = (params === null || params.process === null || params.process === undefined) ? null : params.process;
        var showLoadingTips = (params === null || params.showLoadingTips === null || params.showLoadingTips === undefined) ? true : params.showLoadingTips;
        var loadingTips = (params === null || params.loadingTips === null || params.loadingTips === undefined) ? "正在加载数据，请稍等..." : params.loadingTips;
        var apiDataType = (params === null || params.apiDataType === null || params.apiDataType === undefined) ? this.apiDataType : params.apiDataType;
        var onExceptionInterface = (params === null || params.onExceptionInterface === null || params.onExceptionInterface === undefined) ? null : params.onExceptionInterface;
        if (this.showLoadingTips) this.tips(loadingTips);
        try {
            $.ajax({
                url: apiUrl,
                type: type,
                data: data,
                dataType: apiDataType,
                jsonpCallback:"callback",
                error: function(e) {
                    classSelf.tips("调用数据接口失败！请测试您的数据接口！", 3);
                },
                success: function(data) {
                    $("#" + classSelf.tipsDialogId).modal("hide");
                    if (data.code.toString() === "301") classSelf.clearCookieRedirect();
                    else if (data.code.toString() === "200") {
                        if (process) process(data); //一切没有问题，就处理数据
                    } else {
                        classSelf.tips(data.message, 3);
                        if (onExceptionInterface) onExceptionInterface(data.code, data.message);
                    }
                }
            });
        } catch (e) {
            classSelf.tips("错误名称：" + e.name + "\n错误描述：" + e.message, 3);
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个try-catch块结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    图片延迟加载
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.lazyload = function() {
        require([this.utilStaticPrefix + "/jquery.lazyload.min.js"], function() {
            $(".lazy").lazyload();
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    tabs切换
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapTabs = function(params) {
        require([this.utilStaticPrefix + "/jquery.tabs.min.js"], function() {
            $(".tabs").tabs(params);
        });
    } ;    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面加载的时候执行的公共逻辑
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload = function() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片延迟加载，相应插件已经合并到app.min.js
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.lazyload() ;
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    整个基类逻辑结束
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload();
};