/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：shop/categories(商户->商户分类)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CategoryController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化z-tree
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initZtree();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    确认按钮点击事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm();
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化z-tree
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
CategoryController.prototype.initZtree = function() {
    var classSelf = this;
    classSelf.emptyForm();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Ztree数据
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    classSelf.request(classSelf.apiUrl.shop.categories.tree, [], {
        process: function(data) {
            //获取数据
            var zNodes = data.result;

            //zTree配置信息
            var setting = {
                edit: {
                    enable: true,
                    showRemoveBtn: false, //showRemoveBtn  这里如果需要显示删除按钮，则将false改为showRemoveBtn 方法 
                    showRenameBtn: false
                },
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeRemove: zTreeBeforeRemove,
                    onClick: zTreeOnClick
                }
            };
            //新增节点，判断是第一级才可以增加节点
            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0 || treeNode.level === 1) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function() {
                    var zTree = $.fn.zTree.getZTreeObj("tree");
                    zTree.addNodes(treeNode, {
                        pId: treeNode.id,
                        name: "新加节点"
                    });
                    //这里增加之后，需要绑定右边

                    return false;
                });
            };

            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
            };
            //控制是否显示删除按钮，不能删除第一级按钮
            function showRemoveBtn(treeId, treeNode) {
                return treeNode.level === 1;
            };
            //当删除节点的时候，去询问是否删除
            function zTreeBeforeRemove(treeId, treeNode) {
                //删除节点，需要更新后台数据
                classSelf.request(classSelf.apiUrl.shop.categories.delete, {
                    "id": treeNode.id
                }, {
                    //请求完成之后,刷新当前节点
                    process: function(data) {
                        console.log("删除节点成功！");
                        classSelf.tips("删除节点成功", 2, function() {
                            classSelf.initZtree();
                        });
                    }
                });
            };
            //节点click事件，获取右边详情，并且记住点击节点的id
            function zTreeOnClick(event, treeId, treeNode) {
                //当点击的时候，获取treeNode的id和pId
                var treeNodeId = treeNode.id,
                    treeNodePid = treeNode.pId,
                    flag = true;
                $("#nodeClickId").val(treeNodeId);
                //获取当前点击treeNode的详情，从zNodes获得数据
                for (var i = 0, len = zNodes.length; i < len; i++) {
                    if (treeNodeId == zNodes[i].id) {
                        //这里绑定详细内容
                        var con = $("#treeNodeContent");
                        con.find("input[name='grade']").val(zNodes[i].grade);
                        con.find("input[name='name']").val(zNodes[i].name);
                        con.find("textarea[name='description']").val(zNodes[i].description);
                        con.find("select[name='pId']").val(zNodes[i].pId);
                        con.find("input[name='idx']").val(zNodes[i].idx);
                        con.find("select[name='cIcon']").val(zNodes[i].cIcon);
                        con.find("select[name='isActive']").val(zNodes[i].isActive ? "1" : "0");
                        flag = false;
                    }
                }

                if (treeNodePid && flag) {
                    //如果有PId，说明是新加的节点,需要更新右边的内容（名字和PId，层级是2）
                    $("#treeNodeContent input[name='grade']").val("2");
                    $("#treeNodeContent input[name='name']").val("新加节点");
                    $("#treeNodeContent select[name='pId']").val(treeNodePid);

                    //剩下的内容需要清除
                    $("#treeNodeContent textarea[name='description']").val("");
                    $("#treeNodeContent input[name='idx']").val("");
                }
            };
            $.fn.zTree.init($("#tree"), setting, zNodes);
        }
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
清空表单数据
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
CategoryController.prototype.emptyForm = function() {
    var con = $("#treeNodeContent");
    con.find("input[name='grade']").val("");
    con.find("input[name='name']").val("");
    con.find("textarea[name='description']").val("");
    con.find("select[name='pId']").val("");
    con.find("input[name='idx']").val("");
    con.find("select[name='cIcon']").val("");
    con.find("select[name='isActive']").val("1");

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
修改详情和新增按钮
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
CategoryController.prototype.submitForm = function() {
    var classSelf = this;
    require([
        classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
        classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
    ], function() {

        $("#treeNodeContent").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
            validationEventTrigger: '',
            scroll: false
        });

        $("#btnSubmit").click(function() {
            var clickNodeId = $("#nodeClickId").val(),
                api = classSelf.apiUrl.shop.categories.edit,
                valid = $("#treeNodeContent").validationEngine('validate');
            if (!valid) {
                return false;
            }
            if ($("#tree .curSelectedNode").size() === 0) {
                classSelf.tips("您没有选择节点", 3);
            } else {
                if (clickNodeId == undefined || clickNodeId == "") {
                    api = classSelf.apiUrl.shop.categories.add;
                }

                classSelf.request(api, {
                    "id": clickNodeId,
                    "grade": $("input[name='grade']").val(),
                    "name": $("input[name='name']").val(),
                    "description": $("textarea[name='description']").val() || " ",
                    "pId": $("select[name='pId']").val(),
                    "idx": $("input[name='idx']").val(),
                    "cIcon": $("select[name='cIcon']").val(),
                    "isActive": $("select[name='isActive']").val() ? true : false,
                    "open": true
                }, {
                    //请求完成之后,刷新当前节点
                    process: function(data) {
                        classSelf.tips("修改节点详情完成!", 3, function() {
                            classSelf.initZtree();
                        });
                    }
                });
            }
        });
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new CategoryController;
});
