/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：system/role(系统设置->角色编辑面板)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function RoleController(params) {
    this.rolePanel = params.rolePanel;
    this.parentClass = params.parentClass;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    事件绑定
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    保存角色处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.save();
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
事件绑定
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.bind = function() {
    var classSelf = this;
    $(".perm-ids").delegate("li", "click", function() {
        var _this = $(this),
            _tParent = _this.parent("ul").attr("class");
        //判断用户点击的是哪个模块
        if (_tParent == "role-module") {
            //点击的是模块
            classSelf.moduleClickHander(_this);
        } else if (_tParent == "role-list") {
            //点击的是角色列表
            classSelf.roleListClickHander(_this);
        }
    });

    //向右箭头的点击事件
    $("#selectRole").click(function() {
        //先获取所有选中的权限
        $(".role-list li.active").each(function() {
            var _this = $(this),
                _dataVal = _this.attr("data-value");
            //这里拼接html，并append到结果页面去
            var $_span = $('<span class="remove"><i class="iconfont icon-shanchu1"></i></span>'),
                $_this = _this.clone();
            $_this.append($_span).removeClass("active");
            $(".role-result").append($_this);
            _this.addClass("hide");
            classSelf.inputValHander();

        });
    });
    //删除按钮
    $(".role-result").on('click', '.remove', function() {
        classSelf.removeHander($(this).parent("li"));
        classSelf.inputValHander();
    });
    //清空选择
    $("h3 .empty").click(function() {
        $(".role-result li").each(function() {
            var _this = $(this);
            classSelf.removeHander(_this);
        });
        classSelf.inputValHander();
    });
    //初始化tooltip
    $('[data-toggle="tooltip"]').tooltip();
};


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
移除选中的列表
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.removeHander = function($this) {
    var resultLi = $this,
        resultVal = resultLi.attr("data-value"),
        data_flag = $(".role-module li[class='active']").attr("data-flag");
    resultLi.remove();
    $(".role-list").find("li[data-value='" + resultVal + "'][data-flag='" + data_flag + "']").removeClass("hide").removeClass("active");
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
统计哪些被选中了，出来input框里的数据
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.inputValHander = function() {
    var classSelf = this,
        resultVal = [];
    $(".role-result li").each(function() {
        var _this = $(this);
        resultVal.push(_this.attr("data-value"));
    });
    //循环完了之后，将值填入input的hidden框里
    $("#permIds").val(resultVal.join(","));
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
处理点击模块事件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.moduleClickHander = function($this) {
    var classSelf = this;
    var dataFlag = $this.attr("data-flag");
    //改变当前的active状态
    $this.addClass("active").siblings("li").removeClass("active");
    //控制roleList列表里面，哪些显示，哪些隐藏
    $(".role-list").find("li").removeClass("active");
    //这里要判断哪些已经被添加到结果列表里，若已被添加到结果列表中，则list里则不需要显示出来
    var listRole = $(".role-list").find("li[data-flag='" + dataFlag + "']"),
        resultRole = $(".role-result").find("li[data-flag='" + dataFlag + "']");
    listRole.removeClass("hide").siblings("li[data-flag!='" + dataFlag + "']").addClass("hide");
    listRole.each(function() {
        var listThis = $(this),
            flag = false;
        resultRole.each(function() {
            var resultThis = $(this);
            if (listThis.attr("data-value") == resultThis.attr("data-value")) {
                flag = true;
            }
        });
        if (flag) {
            listThis.addClass("hide");
        }
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
处理点击角色列表
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.roleListClickHander = function($this) {
    var classSelf = this;
    $this.toggleClass("active");
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 保存角色处理
如何知道是新增还是修改？看quickPanel的data-operation属性的值，可以是：add|edit
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RoleController.prototype.save = function() {
    var classSelf = this;
    require([this.parentClass.utilStaticPrefix + "/jquery.asyncsubmit.min.js"], function() {
        $(classSelf.rolePanel).find("form").asyncsubmit({
            utilStaticPrefix: classSelf.parentClass.utilStaticPrefix,
            dataType: classSelf.parentClass.apiDataType,
            onSavingInterface: function() {
                classSelf.parentClass.tips("正在进行处理，请稍等...", 2);
            },
            onErrorInterface: function() {
                classSelf.parentClass.tips("请求失败，请检查您的接口！", 2);
            },
            onSuccessInterface: function(result) {
                classSelf.parentClass.tips("角色保存成功！", 2, function() {
                    window.location.reload();
                });
            },
            onExceptionInterface: function(message) {
                classSelf.parentClass.tips("<span class=\"text-danger\">" + message + "</span>", 5);
            }
        });
    });
};
