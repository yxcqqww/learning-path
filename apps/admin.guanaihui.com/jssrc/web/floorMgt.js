/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：web/floorMgt(WEB管理->楼层管理)
 3. 作者：刘昌逵(yinqin@360guanai.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function FloorMgtController(){
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    this.init();
}

FloorMgtController.prototype.init = function(){

    var _co = this;

    // 向上移动
    $("body").on("click",".j-btn-up",function(){
        var $currentTr = $(this).parents("tr:eq(0)");
        var $prevTr = $currentTr.prev();
        if($prevTr.length>0){
            // 获取序号
            var currentOrder = $currentTr.find("td:eq(0)").text();
            var nextOrder = $prevTr.find("td:eq(0)").text();
            // 调换序号
            var $cloneTr = $currentTr.clone();
            $cloneTr.find("td:eq(0)").text(nextOrder);
            $prevTr.find("td:eq(0)").text(currentOrder);
            $currentTr.remove();
            $cloneTr.insertBefore($prevTr);
        }
    });

    // 向下移动
    $("body").on("click",".j-btn-down",function(){
        var $currentTr = $(this).parents("tr:eq(0)");

        var $nextTr = $currentTr.next();

        if($nextTr.length>0){
            // 获取序号
            var currentOrder = $currentTr.find("td:eq(0)").text();
            var nextOrder = $nextTr.find("td:eq(0)").text();
            // 调换序号
            var $cloneTr = $currentTr.clone();
            $cloneTr.find("td:eq(0)").text(nextOrder);
            $nextTr.find("td:eq(0)").text(currentOrder);
            $currentTr.remove();
            $cloneTr.insertAfter($nextTr);
        }
    });

    // 保存顺序
    $("#btnSaveOrder").on("click",function(){
        var api = $(this).attr("data-interface");
        var data = {"ids":[]};
        $("#floorTable tbody tr").each(function(i,item){
            data.ids.push($(item).attr("data-id"));
        });
        data.ids = data.ids.join(",");
        _co.request(api, data, {
            process: function(data) {
                window.location.reload();
            }
        });
    });

    // 删除/停用/启用
    $("body").on("click",".j-delete,.j-stop,.j-start",function(){
        var floorId = $(this).parents("tr:eq(0)").attr("data-id");
        var api = $(this).attr("data-interface");
        var data = {id:floorId};
        _co.request(api, data, {
            process: function(data) {
                window.location.reload();
            }
        });
    });

    // 弹出新增
    $("#btnCreateFloor").on("click",function(){
        var api = $(this).attr("data-interface");
        $("#modalBox").load(api,function(){
            $("#floorModal").modal();
            // 初始化日历
            require([
                //_co.bootstrapStaticPrefix + "/plugins/datetimepicker/js/bootstrap-datetimepicker.js" ,
                _co.bootstrapStaticPrefix + "/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"
            ], function(){
                $.fn.datetimepicker.defaults.language = 'zh-CN' ;
                // 开始时间
                $("#floorModal").find("input[name='startTimePicker']").datetimepicker({
                    format : "yyyy-mm-dd hh:ii:ss" ,
                    language :  "zh-CN" ,
                    weekStart : 1 ,
                    autoclose : 1 ,
                    minuteStep:1,
                    forceParse: 0,
                    linkField:"startTime"
                }).on('changeDate', function(ev){
                });
                // 结束时间
                $("#floorModal").find("input[name='endTimePicker']").datetimepicker({
                    format : "yyyy-mm-dd hh:ii:ss" ,
                    language :  "zh-CN" ,
                    weekStart : 1 ,
                    autoclose : 1 ,
                    minuteStep:1,
                    forceParse: 0,
                    linkField:"endTime"
                }).on('changeDate', function(ev){
                });
            }) ;
        });
    });

    // 弹出编辑
    $("body").on("click",".j-editor",function(){
        var api = $(this).attr("data-interface");
        $("#modalBox").load(api,function(){
            // 选中下拉框
            $("#modalBox select").each(function(i,item){
                var val = $(this).attr("value");
                $(item).find("option[value="+val+"]").attr("selected","selected");
            });
            $("#floorModal").modal();
            // 初始化日历
            require([
                //_co.bootstrapStaticPrefix + "/plugins/datetimepicker/js/bootstrap-datetimepicker.js" ,
                _co.bootstrapStaticPrefix + "/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"
            ], function(){
                $.fn.datetimepicker.defaults.language = 'zh-CN' ;
                // 开始时间
                $("#floorModal").find("input[name='startTimePicker']").datetimepicker({
                    format : "yyyy-mm-dd hh:ii:ss" ,
                    language :  "zh-CN" ,
                    weekStart : 1 ,
                    autoclose : 1 ,
                    forceParse: 0,
                    linkField:"startTime"
                }).on('changeDate', function(ev){
                });
                // 结束时间
                $("#floorModal").find("input[name='endTimePicker']").datetimepicker({
                    format : "yyyy-mm-dd hh:ii:ss" ,
                    language :  "zh-CN" ,
                    weekStart : 1 ,
                    autoclose : 1 ,
                    forceParse: 0,
                    linkField:"endTime"
                }).on('changeDate', function(ev){
                });
            }) ;
        });
    });

    // 创建/保存
    $("body").on("click","#modalBox .j-save",function(){
        var data = $("#modelForm").serialize();
        var api = $(this).attr("data-interface");
        _co.request(api, data, {
            process: function(data) {
                window.location.reload();
            }
        });
    });



};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new FloorMgtController;
});