/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：web/details-templateK(WEB管理->楼层管理->楼层内容)
 3. 作者：刘昌逵(liuchangkui@360guanai.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function DetailsTemplateController(){
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    this.init();

}

DetailsTemplateController.prototype.init = function(){
    var _co = this;
    // 弹出编辑框
    $("body").on("click",".j-editor",function(){
        var $tr = $(this).parents("tr").eq(0);
        var imgSrc = $tr.find("[name='img']").attr("data-src");
        // 根据name属性填充编辑框
        $tr.find("[name]").each(function(){
            var name = $(this).attr("name");
            var data = $(this).attr("data");
            var $e = $("#modelForm").find("[name='"+name+"']");
            var uploadButtonText = " + 上传图片";
            if(data){
                $e.is("img") ? (uploadButtonText= '更换图片',$e.attr("src",data)) : $e.val(data);
            }
            require([_co.utilStaticPrefix + "/uploadify/jquery.uploadify.min.js"], function () {
                $("#fileUploader").uploadify({
                    buttonText: uploadButtonText,
                    height: 34,
                    fileObjName: "files",
                    fileSizeLimit: "1024KB",
                    fileTypeExts: "*.jpg;*.jpeg;*.png",
                    formData: {category: "advertiseSchedule"},
                    swf: _co.utilStaticPrefix + "/uploadify/uploadify.swf",
                    uploader: _co.apiUrl.attachment.upload,
                    uploadLimit: 9,
                    removeTimeout: 1,
                    width: 120,
                    onQueueComplete: function (t) {
                        $("#queue").attr("data-amount-successful", t.uploadsSuccessful).attr("data-amount-errored", t.uploadsErrored)
                    },
                    onUploadSuccess: function (e, n) {
                        var n = $.parseJSON(n), a = new Array;
                        $(n.result).each(function () {
                            a.push(this.url)
                        }), $(t.advertiseSchedulePanel).find(".modal-body input[name='icon']").val(a.join(",")), $(t.advertiseSchedulePanel).find(".modal-body .uploaded-pict img").attr("src", a[0]), $(t.advertiseSchedulePanel).find(".modal-body .uploaded-pict").show()
                    }
                })
            })
        });

        $("#templateModal").modal();

    });

    // 保存
    $("body").on("click",".j-save",function(){
        var data = $("#modelForm").serialize();
        var api = $(this).attr("data-interface");
        _co.request(api, data, {
            process: function(data) {
                _co.tips(data.message,2,function(){
                    window.location.reload();
                });
            },
            onExceptionInterface:function(code,msg){
                _co.tips(msg,1);
            }
        });
    });


};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new DetailsTemplateController;
});