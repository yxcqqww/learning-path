/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：web/navmgt(WEB管理->导航菜单管理)
 3. 作者：刘昌逵(yinqin@360guanai.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function NavmgtController(){
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    this.init();
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 新增／编辑
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
NavmgtController.prototype.init = function(){

    var _co = this;

    // 弹出新增
    $("#btnCreateNav").on("click",function(){
        var $model = $("#navModal");
        // 更改模态框标题
        var $modelTitle = $model.find(".modal-title");
        $modelTitle.text($modelTitle.attr("data-text-create"));
        // 更改确认按钮文本内容
        var $btnPrimary = $model.find(".btn-primary");
        $btnPrimary.text($btnPrimary.attr("data-text-create"));
        $btnPrimary.removeClass("j-btn-editor").addClass("j-btn-creator");
        $('#navModal').modal();
        // 清空数据
        $model.find("[type='text']").val("");
        $model.find("[type='checkbox']").removeAttr("checked");
        $model.find("[type='radio']:eq(0)").click();
    });

    // 弹出编辑
    $("body").on("click",".j-editor",function(){
        var $tr = $(this).parents("tr").eq(0);
        var $dataEle = $tr.find("[data-name]");
        // 获取数据
        var data={};
        $dataEle.each(function(i,item){
            data[$(item).attr("data-name")]=$(item).attr("data");
        });
        var $model = $("#navModal");
        // 更改模态框标题
        var $modelTitle = $model.find(".modal-title");
        $modelTitle.text($modelTitle.attr("data-text-edit"));
        // 更改确认按钮文本内容
        var $btnPrimary = $model.find(".btn-primary");
        $btnPrimary.text($btnPrimary.attr("data-text-edit"));
        $btnPrimary.removeClass("j-btn-creator").addClass("j-btn-editor");
        // 清空数据
        $model.find("[type='text']").val("");
        $model.find("[type='checkbox']").removeAttr("checked");
        // 填充数据
        for(var key in data){
            var $e = $model.find("[name="+key+"]");
            if($e.attr("type")==="text"){
                $e.val(data[key]);
            }else if($e.attr("type")==="checkbox" || $e.attr("type")==="radio"){
                $e.filter("[value="+data[key]+"]").click();
            }
        }
        $model.modal();
    });

    // 执行新增
    $("body").on("click",".j-btn-creator",function(){

        var data=$("#modelForm").serialize();
        data=data+"&idx="+$("#navTable tbody tr").length;
        var api =$(this).attr("data-interface-create");
        _co.request(api, data, {
            //请求完成之后,刷新当前节点
            process: function(data) {
                _co.tips(data.message,2,function(){
                   window.location.reload();;
                });
            },
            onExceptionInterface:function(code,msg){
                _co.tips(msg,1);
            }
        });
    });

    // 执行编辑
    $("body").on("click",".j-btn-editor",function(){
        var data=$("#modelForm").serialize();
        var api =$(this).attr("data-interface-edit");
        _co.request(api, data, {
            //请求完成之后,刷新当前节点
            process: function(data) {
                _co.tips(data.message,2,function(){
                    window.location.reload();;
                });
            },
            onExceptionInterface:function(code,msg){
                _co.tips(msg,1);
            }
        });
    });

    // 向上移动
    $("body").on("click",".j-btn-up",function(){
        var $currentTr = $(this).parents("tr:eq(0)");
        var $prevTr = $currentTr.prev();
        if($prevTr.length>0){
            var $cloneTr = $currentTr.clone();
            $currentTr.remove();
            $cloneTr.insertBefore($prevTr);
        }
    });

    // 向下移动
    $("body").on("click",".j-btn-down",function(){
        var $currentTr = $(this).parents("tr:eq(0)");
        var $nextTr = $currentTr.next();
        if($nextTr.length>0){
            var $cloneTr = $currentTr.clone();
            $currentTr.remove();
            $cloneTr.insertAfter($nextTr);
        }
    });

    // 保存顺序
    $("#btnSaveOrder").on("click",function(){
        var api = $(this).attr("data-interface");
        var data = {"ids":[]};
        $("#navTable tbody tr").each(function(i,item){
            data.ids.push($(item).attr("data-id"));
        });
        data.ids=data.ids.join(",");
        _co.request(api, data, {
            //请求完成之后,刷新当前节点
            process: function(data) {
                _co.tips(data.message,2,function(){
                    window.location.reload();;
                });
            }
        });
    });

};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new NavmgtController;
});