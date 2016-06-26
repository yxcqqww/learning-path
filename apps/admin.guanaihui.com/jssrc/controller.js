/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：Controller (每个页面的类都继承于这个控制器基类)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：对api的依赖：jQuery
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Controller() {
        
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     静态资源域名序列随机化，为什么要定义在上面，因为在后面定义的话前面用这个方法取不到
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.randomDomainSn = function () {
        //var sn = parseInt(Math.random() * 20 + 1, 10).toString() ;
        var sn = Math.floor(Math.random() * 10 + 1).toString();
        if (sn.length < 2) sn = "0" + sn;
        return sn;
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     对环境的定义：
     @development : 开发环境，对应静态资源域名为：dev01.guanaihui.cn - source10.guanaihui.cn
     @test：测试环境，对应静态资源域名为：stage01.guanaihui.cn - stage10.guanaihui.cn
     @preview：预发布环境，对应静态资源域名为：preview01.guanaihui.cn - preview10.guanaihui.cn
     @production ：生产环境，对应静态资源域名为：cdn01.guanaihui.com - cdn10.guanaihui.com
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.environment = "dev"; //环境定义

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     域名前后缀
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.domainSuffix = (this.environment === "production") ? "com" : "cn";
    this.staticDomainPrefix = "dev";
    if (this.environment === "test") this.staticDomainPrefix = "stage";
    else if (this.environment === "preview") this.staticDomainPrefix = "preview";
    else if (this.environment === "production") this.staticDomainPrefix = "cdn";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     一些关于cookie参数的配置
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.cookieDomain = (this.environment === "production") ? ".guanaihui.com" : ".guanaihui.cn";  //cookie域名设置
    this.cookieExpires = 60; //整个应用cookie的生存周期，单位为分钟
    this.cookieKeyPrefix = "A_"; //cookie的key值前缀，用来区分哪个模块的cookie，比如M_表示M站，O_表示Offical website(官网)，A表示Admin(管理系统)
    this.cookieKeyConf = {
        "public": {
            "selectUsers": {
                "selectedRecently": this.cookieKeyPrefix + "selectedUsersRecently"
            }
        },
        "shop": {
            "company": {
                "category": this.cookieKeyPrefix + "shopCategory"
            },
            "gallery": {
                "category": this.cookieKeyPrefix + "shopGalleryCategory"
            }
        },
        "system": {
            "rememberMe": this.cookieKeyPrefix + "rememberMe",
            "username": this.cookieKeyPrefix + "username"
        }
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     根据环境决定static资源域名前缀
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.staticDomain = "//" + this.staticDomainPrefix + this.randomDomainSn() + ".guanaihui." + this.domainSuffix;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     工具库路径及应用的控制器路径
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bootstrapStaticPrefix = this.staticDomain + "/bootstrap";
    this.utilStaticPrefix = this.staticDomain + "/guanaihui/js/util";
    this.appStaticPrefix = this.staticDomain + "/apps/admin.guanaihui.com/js";
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
     接口的地址，把整个应用的所有接口地址写在这里，方便统一维护
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiPrefix = (this.environment === "development") ? "//admin.guanaihui.cn/" : "/" //api接口地址前缀
    //this.apiPrefix = (this.environment === "development") ? "//192.168.150.163:8080/" : "/" //api接口地址前缀
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     商品管理模块API地址
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiUrl = {
        "system": {
            "role": {
                "add": this.apiPrefix + "role/add",
                "edit": this.apiPrefix + "role/update",
                "delete": this.apiPrefix + "role/delete"
            },
            "employee": {
                "add": this.apiPrefix + "employee/add",
                "edit": this.apiPrefix + "employee/update",
                "delete": this.apiPrefix + "employee/delete",
                "cpwd": this.apiPrefix + "employee/cpwd"
            },
            "login": this.apiPrefix + "ajaxLogin",
            "logout": this.apiPrefix + "ajaxLogout"
        },
        "attachment": {
            "upload": this.apiPrefix + "attachment/upload" //附件上传接口
        },
        "shop": {
            "brand": {
                "add": this.apiPrefix + "company/add",  //新增品牌保存接口
                "edit": this.apiPrefix + "company/edit"  //编辑品牌保存接口
            },
            "gallery": {
                "classify": this.apiPrefix + "gallery/addImages",  //图库->对上传的图片进行关联关系添加的接口
                "delete": this.apiPrefix + "gallery/removeImages",  //图库->删除图片接口
                "sequence": this.apiPrefix + "gallery/saveOrderIdx" //图库->保存图片顺序接口
            },
            "branches": {
                "setHead": this.apiPrefix + "shop/setHead",  //门店->设为总店接口,
                "setTjtHead": this.apiPrefix + "shop/setHead?isTjt=true",  //体检通门店->设为总店接口,
                "delete": this.apiPrefix + "shop/remove",  //门店->删除门店接口
                "add": this.apiPrefix + "shop/add",  //门店->新增门店接口
                "edit": this.apiPrefix + "shop/edit"  //门店->新增门店接口
            },
            "contracts": {
                "add": this.apiPrefix + "contract/addContract",  //合同->新增合同接口
                "edit": this.apiPrefix + "contract/editContract",  //合同->编辑合同接口
                "cancel": this.apiPrefix + "contract/discardContract"   //合同->作废合同接口
            },
            "products": {
                "add": this.apiPrefix + "product/add",  //商品->新增商品接口
                "edit": this.apiPrefix + "product/edit",  //商品->新增商品接口
                "delete": this.apiPrefix + "product/remove",  //商品->删除商品接口
                "offline": this.apiPrefix + "product/offline",  //商品->下线商品接口
                "release": this.apiPrefix + "product/online"  //商品->重新上线商品接口
            },
            "ownership": {
                "setOwnerShip": this.apiPrefix + "extshop/setOwnership"  //设置归属商户接口
            },
            "categories": {
                "list": this.apiPrefix + "category/list", //一二级分类联动数据接口
                "tjtList": this.apiPrefix + "category/list?id=16", //一二级分类中体检机构联动数据接口
                "tree": this.apiPrefix + "category/listAll", //一二级分类树形菜单数据接口
                "add": this.apiPrefix + "category/add", //新增分类接口
                "edit": this.apiPrefix + "category/update", //增加二级管理分类接口
                "delete": this.apiPrefix + "category/remove" //删除二级管理分类接口                
            },
            "offline": this.apiPrefix + "company/offline",   //商户下线接口
            "online": this.apiPrefix + "company/setOnline",   //商户上线接口
            "transfer": this.apiPrefix + "company/ setReady"   //待处理商户转待上线接口
        }
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     登录成功后跳转地址
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.homeUrl = "/index";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     登出后跳转地址
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.loginUrl = "/";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     新增模态框的公共方法，是下面的this.dialog和this.tips两个方法的基础方法
     1. 使用方法：
     this.createModalDialog({
     "type" : "dialog" ,  //模态框类型，值为：dialog | tips | confirm
     "id" : "my-modal-dialog" ,  //模态框ID值
     "effect" : true ,  //弹出dialog的时候是否需要fade效果
     "tabindex" : 1 ,  //模态框的tabindex值
     "dimension" : "lg"  //模态框的尺寸，可以是："sm" | "lg" 分别指小模态框和大模态框
     }) ;
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.createModalDialog = function (params) {
        var type = (params === null || params.type === null || params.type === undefined) ? "dialog" : params.type;
        var effect = (params === null || params.effect === null || params.effect === undefined) ? true : params.effect;
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex;
        var dimension = (params === null || params.dimension === null || params.dimension === undefined) ? "" : params.dimension;
        var id = params.id;
        if (type === "tips") id = this.tipsDialogId;
        else if (type === "confirm") id = this.confirmDialogId;
        var modal = $(document.createElement("DIV")).attr("id", id).attr("role", "dialog").attr("aria-labelledby", "myModalLabel").addClass("modal");
        if (effect) $(modal).addClass("fade");
        if (tabindex) $(modal).attr("tabindex", tabindex);
        var modalDialog = $(document.createElement("DIV")).attr("role", "document").addClass("modal-dialog").append($(document.createElement("DIV")).addClass("modal-content"));
        if (dimension) {
            $(modal).addClass("bs-example-modal-" + dimension);
            $(modalDialog).addClass("modal-" + dimension);
        }
        $(modal).append(modalDialog);
        $("body").prepend(modal);
    };
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
    this.dialog = function (params) {
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex;
        var dimension = (params === null || params.dimension === null || params.dimension === undefined) ? "" : params.dimension;
        if ($("#" + params.id).size() > 0) $("#" + params.id).remove();
        this.createModalDialog({
            "type": "dialog",
            "id": params.id,
            "tabindex": tabindex,
            "dimension": dimension
        });
        $("#" + params.id).modal({
            remote: params.url
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         让dialog在纵向居中
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        /*
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
         */
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
        };
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     弹出tips提示框，参数：
     @content：提示的html信息
     @time：表示多少秒之后关闭，如果为0表示不关闭，单位为秒
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.tips = function (content, time, callback) {
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
            window.setTimeout(function () {
                $("#" + classSelf.tipsDialogId).modal("hide");
                if (callback) callback();
            }, time * 1000);
        }
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     确认框
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.confirm = function (params) {
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
            $(confirmBtn).click(function () {
                if (confirmInterface) confirmInterface();
                $("#" + classSelf.confirmDialogId).modal("hide");
            });
            $(confirmFooter).append(confirmBtn);
        }
        if (showCancelBtn) {
            var cancelBtn = $(document.createElement("BUTTON")).attr("type", "button").addClass("btn btn-default btn-sm").attr("data-dismiss", "modal").text(cancelLabel);
            $(cancelBtn).click(function () {
                $("#" + classSelf.confirmDialogId).modal("hide");
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
    this.request = function (apiUrl, data, params) {
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
                jsonpCallback: "callback", //这个配置是在没有真正后端接口前端用自己的 json文件模拟接口的时候为了保持callback参数值一致所做的设置
                error: function (e) {
                    classSelf.tips("调用数据接口失败！请测试您的数据接口！", 3);
                },
                success: function (data) {
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
    this.lazyload = function () {
        require([this.utilStaticPrefix + "/jquery.lazyload.min.js"], function () {
            $(".lazy").lazyload();
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     tabs切换
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapTabs = function (params) {
        require([this.utilStaticPrefix + "/jquery.tabs.min.js"], function () {
            $(".tabs").tabs(params);
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     侧边栏逻辑实例化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceAside = function () {
        if ($(".aside").size() === 0) return;
        require([this.appStaticPrefix + "/aside.min.js"], function () {
            new Aside;
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     实例化条理化表格
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceMethodizeTable = function (options) {
        require([this.utilStaticPrefix + "/jquery.methodizetable.min.js"], function () {
            $(".data-panel table").methodizetable(options);
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     登出功能绑定
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.logout = function () {
        if ($(".header .logout").size() === 0) return;
        var classSelf = this;
        $(".header .logout").click(function () {
            classSelf.request(classSelf.apiUrl.system.logout, {}, {
                process: function () {
                    window.location.href = classSelf.loginUrl;
                }
            });
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     点击路径导航中的商户管理链接
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.backCompanyList = function () {
        var classSelf = this;
        $(".content-wrapper .path-navigation .company-list").click(function () {
            $(this).attr("href", $.cookie(classSelf.cookieKeyConf.shop.company.category));
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     调整分页参数如果必须的话
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*this.pageAdjustment = function (_target) {
        var paramName = 'page';
        var queryPage = this.getQueryString(_target, 'page');
        if (queryPage == null) {
            queryPage = this.getQueryString(_target, 'pageIndex');
            if (queryPage != null) {
                paramName = 'pageIndex';
            } else {
                return;
            }
        }

        var totalPage = $('#_pageCount').val();
        if (!isNaN(totalPage) && queryPage > totalPage) {
            var url = _target.location.href;
            var newUrl = this.changeURLArg(url, paramName, totalPage);
            _target.location.replace(newUrl);
            var Url=window.location.href;
            var start=Url.indexOf('?');
            var end=Url.indexOf('&');
            var newIndex=Number(start)+6;
            var str=Url.substring(newIndex,end);
            var  newUrl=Url.replace(str,totalPage);
            window.location.href=newUrl;
        }
    }*/
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     调整分页参数如果必须的话
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.pageAdjustment = function (_target) {
        var paramName = 'page';
        var queryPage = this.getQueryString(_target, 'page');
        if (queryPage == null) {
            queryPage = this.getQueryString(_target, 'pageIndex');
            if (queryPage != null) {
                paramName = 'pageIndex';
            } else {
                return;
            }
        }
        var totalPage = $('#_pageCount').val();
        if (!isNaN(totalPage) && Number(queryPage) > Number(totalPage)) {
            var url = _target.location.href;
            var newUrl = this.changeURLArg(url, paramName, totalPage);
            _target.location.replace(newUrl);
        }
    }

    /*
     * url 目标url
     * arg 需要替换的参数名称
     * arg_val 替换后的参数的值
     * return url 参数替换后的url
     */
    this.changeURLArg = function (url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     获取或设置查询参数
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.getQueryString = function (_target, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = _target.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    /*
     * url 目标url
     * arg 需要替换的参数名称
     * arg_val 替换后的参数的值
     * return url 参数替换后的url
     */
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     页面加载的时候执行的公共逻辑
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload = function () {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         图片延迟加载，相应插件已经合并到app.min.js
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.lazyload();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         tooltips初始化
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $("[data-toggle='tooltip']").tooltip();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         初始化分页监听事件
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('.page>.item>a').one('click', this.pageAdjustment(window.top));
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         侧边栏逻辑实例化
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.instanceAside();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         登出功能绑定
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.logout();
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     整个基类逻辑结束
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload();
};