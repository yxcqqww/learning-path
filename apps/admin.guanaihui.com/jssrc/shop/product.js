/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：admin.guanaihui.com
 2. 页面名称：shop/product(商户->服务编辑模板)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：

 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ProductController(params) {
    this.productPanel = params.productPanel ;
    this.parentClass = params.parentClass ;        
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化tabs
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.parentClass.swapTabs({ eventType : "click" , effect : "fadeIn" , duration : 100}) ;   
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    从shopIds和productTagIds这两个隐藏域里面去分析，哪些select的选项是要被selected的，而且这个任务一定要在this.instanceSelect2() ;任务前执行
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initSelectOptions() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化select2
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.instanceSelect2() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    实例化多文件上传组件：uploadify
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initUploadify() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    事件绑定处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.bind() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    异步提交处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.save() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击上下移改变信息位置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.changePosition();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
事件绑定处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.bind = function() {
    var classSelf = this;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    服务项目新增按钮
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $(this.productPanel).find(".items .add").click(function(){
        classSelf.addItem();
        $('.j-btn-up').html('上移').eq(0).html(''); 
        if($('.j-btn-up').length!=1){
            $('.j-btn-down').html('下移').eq($('.j-btn-up').length-1).html(''); 
        }
    }) ; 
    $(this.productPanel).find(".items .addIntr").click(function(){
        classSelf.addIntroduct();
        $('.j-btn-up').html('上移').eq(0).html(''); 
        if($('.j-btn-up').length!=1){
            $('.j-btn-down').html('下移').eq($('.j-btn-up').length-1).html(''); 
        }
        
    }) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    预约须知新增按钮
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $(this.productPanel).find(".notices .add").click(function(){
        var notice = $.trim($(classSelf.productPanel).find(".notices input[name='notice']").val()) ;
        if( ! notice ) {
            classSelf.parentClass.tips("请输入内容！", 2) ;
            return false ;
        }
        classSelf.addNotice(notice) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        最后要将文本框的值清空
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(classSelf.productPanel).find(".notices input[name='notice']").val("") ;
    }) ; 
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    预约须知每行的删除按钮
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $(this.productPanel).find(".notices .result li").each(function(){
        var $notice = this ;
        $(this).find(".remove").click(function(){
            $notice.remove() ;
        }) ;
    }) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    服务项目每行的删除按钮
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $(this.productPanel).find(".items table tbody tr").each(function(){
        var $tr = this ;
        $(this).find(".remove").click(function(){
            var itemId = $(this).parent('td').siblings('.noWidth').find('.itemId').val();
            $(".items input[name='itemsDelId']").val($(".items input[name='itemsDelId']").val()+'&&'+itemId);
            console.log( $(".items input[name='itemsDelId']").val());
            $tr.remove();
            classSelf.totalMarketPrice() ;
            classSelf.totalGuanaiPrice() ;
            classSelf.totalVipPrice() ;
        }) ;        
        $(this).find("input[name='streetPrice']").change(function(){
            classSelf.totalMarketPrice() ;
        }) ;
        $(this).find("input[name='promotionPrice']").change(function(){
            classSelf.totalGuanaiPrice() ;
        }) ;
        $(this).find("input[name='giftCardPrice']").change(function(){
            classSelf.totalVipPrice() ;
        }) ;
    }) ;
     
    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
服务项目表格增加一行
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.addItem = function() {
    var classSelf = this ;
    var $tr = $(document.createElement("TR")).append("<td><a href=\"javascript:;\" class=\"j-btn-up\">上移</a><a href=\"javascript:;\" class=\"j-btn-down\">下移</a></td>").append("<td><input name=\"itemName\" class=\"form-control  input-sm\" data-validation-engine=\"validate[required,maxSize[10]]\" placeholder=\"10汉字以内\"></td>").append("<td><input name=\"amount\" class=\"form-control  input-sm\" data-validation-engine=\"validate[custom[integer],max[9]]\"></td>");
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制市场价TD
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var $streetPrice = $(document.createElement("INPUT")).attr("name", "streetPrice").attr("data-validation-engine", "validate[custom[number],max[100000]]").addClass("form-control input-sm") ;
    $streetPrice.change(function(){
        classSelf.totalMarketPrice() ;
    }) ;
    var $streetPriceTd = $(document.createElement("TD")).append($streetPrice) ;
    $tr.append($streetPriceTd) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制会员价TD
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var $promotionPrice = $(document.createElement("INPUT")).attr("name", "promotionPrice").attr("data-validation-engine", "validate[custom[number],max[100000]]").addClass("form-control input-sm") ;
    $promotionPrice.change(function(){
        classSelf.totalGuanaiPrice() ;
    }) ;
    var $promotionPriceTd = $(document.createElement("TD")).append($promotionPrice) ;
    $tr.append($promotionPriceTd) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制礼卡价TD
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var $giftCardPrice = $(document.createElement("INPUT")).attr("name", "giftCardPrice").attr("data-validation-engine", "validate[custom[number],max[100000]]").addClass("form-control input-sm") ;
    $giftCardPrice.change(function(){
        classSelf.totalVipPrice() ;
    }) ;
    var $giftCardPriceTd = $(document.createElement("TD")).append($giftCardPrice) ;
    $tr.append($giftCardPriceTd) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制删除按钮TD
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var $remove = $(document.createElement("I")).addClass("iconfont icon-shanchu remove") ;
    $tr.append($(document.createElement("TD")).append($remove)) ;
    $tr.append('<td class=\"noWidth\"><input style=\"display:none;\" class=\"itemId\" name=\"itemId\" value=\"\"></td><td class=\"noWidth\"><input style=\"display:none;\" class=\"itemType\" name=\"itemType\" value=\"1\"></td>');
    $remove.click(function(){
        $tr.remove() ;
        classSelf.totalMarketPrice() ;
        classSelf.totalGuanaiPrice() ;
        classSelf.totalVipPrice() ;
    }) ;
    $(this.productPanel).find(".modal-body .items table tbody").append($tr) ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
新增说明增加一行
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.addIntroduct=function(){
    var classSelf = this ;
    var $tr = $(document.createElement("TR")).append("<td><a href=\"javascript:;\" class=\"j-btn-up\">上移</a><a href=\"javascript:;\" class=\"j-btn-down\">下移</a></td>").append("<td  colspan=\"5\" class=\"onlyW\"><input name=\"itemName\" class=\"form-control intro input-sm\" data-validation-engine=\"validate[required,maxSize[10]]\" placeholder=\"10汉字以内\"></td>");
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制删除按钮TD
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var $remove = $(document.createElement("I")).addClass("iconfont icon-shanchu remove") ;
    $tr.append($(document.createElement("TD")).append($remove)) ;
    $tr.append('<td class=\"noWidth\"><input style=\"display:none;\" class=\"itemId\" name=\"itemId\" value=\"\"></td><td class=\"noWidth\"><input style=\"display:none;\" class=\"itemType\" name=\"itemType\" value=\"2\"></td>')
    $remove.click(function(){
        $tr.remove() ;
        classSelf.totalMarketPrice() ;
        classSelf.totalGuanaiPrice() ;
        classSelf.totalVipPrice() ;
    }) ;
    $(this.productPanel).find(".modal-body .items table tbody").append($tr) ; 
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
点击排序改变数据顺序
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

ProductController.prototype.changePosition=function(){
    /*var Index;
    $('.j-btn-up').eq(0).html('');
    $('body').on('click','.j-btn-up',function(){
        var trCopy = $(this).closest('tr').clone(true);
        for(var i=0;i<$(this).closest('tbody').children('tr').length;i++){
            if($(this).closest('tbody').children('tr').eq(i)==$(this).closest('tr')){
                Index=i;
            }
        }
        console.log(Index);
        $(this).closest('tbody').children('tr').eq(Index-1).insertBefore(trCopy);
        $(this).closest('tr').remove();
        $('.j-btn-up').html('上移').eq(0).html('');
    });*/
    /*初始化页面的时候向上按钮消失*/
    $('.j-btn-up').eq(0).html('');
    if($('.j-btn-up').length!=1){
            $('.j-btn-down').html('下移').eq($('.j-btn-up').length-1).html(''); 
        }
    // 向上移动
    $("body").on("click",".j-btn-up",function(){
        var $currentTr = $(this).parents("tr:eq(0)");
        var $prevTr = $currentTr.prev();
        if($prevTr.length>0){
            var $cloneTr = $currentTr.clone();
            $currentTr.remove();
            $cloneTr.insertBefore($prevTr);
        }
        $('.j-btn-up').html('上移').eq(0).html('');
         $('.j-btn-down').html('下移').eq($('.j-btn-up').length-1).html(''); 
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
        $('.j-btn-up').html('上移').eq(0).html(''); 
        if($('.j-btn-up').length!=1){
            $('.j-btn-down').html('下移').eq($('.j-btn-up').length-1).html(''); 
        }
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
服务项目表格增加一行
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.addNotice = function(content) {
    var $notice = $(document.createElement("LI")).append(document.createTextNode(content));
    var $remove = $(document.createElement("A")).append("<i class=\"iconfont icon-shanchu remove\"></i>") ;
    $notice.append($remove) ;
    $remove.click(function(){
        $notice.remove() ;
    }) ;
    $(this.productPanel).find(".modal-body .notices .result").append($notice) ;    
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化select2
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.instanceSelect2 = function(content) {  
   $(this.productPanel).find("select").select2({
       "placeholder" : "请选择" ,
       "width" : "100%"
   }) ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
异步提交处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.save = function() {
    var classSelf = this ;    
    require([this.parentClass.utilStaticPrefix + "/jquery.asyncsubmit.min.js"], function(){
        $(classSelf.productPanel).find("form").asyncsubmit({            
            utilStaticPrefix : classSelf.parentClass.utilStaticPrefix ,
            dataType : classSelf.parentClass.apiDataType ,
            beforeSaveInterface : function(){
                 classSelf.union() ;
            } ,
            onSavingInterface : function() {
                classSelf.parentClass.tips("正在进行处理，请稍等...") ;                   
            } ,
            onErrorInterface : function() {
                classSelf.parentClass.tips("请求失败，请检查您的接口！", 2) ;                    
            } ,
            onSuccessInterface : function(result) {
                classSelf.parentClass.tips("保存服务成功！", 2, function(){
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
异步提交处理前把服务项目和预约须知组织起来
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.union = function() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    聚合预约须知信息
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var notices = new Array ;
    $(this.productPanel).find(".notices .result li").each(function(){
         notices.push($(this).text()) ;
    }) ;
    $(this.productPanel).find(".notices input[name='notices']").val(notices.join("&&")) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    聚合服务项目信息
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var items = new Array ;
    $(this.productPanel).find(".items tbody tr").each(function(){
         var itemName = $(this).find("input[name='itemName']").val() ;
         if(itemName) itemName = $.trim(itemName);
         var amount = $(this).find("input[name='amount']").val() ;
         if(amount) amount = $.trim(amount) ;
         var streetPrice = $(this).find("input[name='streetPrice']").val() ;
         if(streetPrice) streetPrice = $.trim(streetPrice) ;
         var promotionPrice = $(this).find("input[name='promotionPrice']").val() ;
         if(promotionPrice) promotionPrice = $.trim(promotionPrice);
         var giftCardPrice = $(this).find("input[name='giftCardPrice']").val();
         if(giftCardPrice) giftCardPrice = $.trim(giftCardPrice);
		 var itemId = $(this).find("input[name='itemId']").val();
         if(itemId) itemId = $.trim(itemId);
         var itemType = $(this).find("input[name='itemType']").val();
         if(itemType) itemType = $.trim(itemType);
         items.push(itemId + "||" +itemName + "||" + amount + "||" + streetPrice + "||" + promotionPrice + "||" + giftCardPrice+"||" +itemType);
    });
    console.log(items);
    $(this.productPanel).find(".items input[name='items']").val(items.join("&&")) ;
    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
从shopIds和productTagIds这两个隐藏域里面去分析，哪些select的选项是要被selected的
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.initSelectOptions = function() {
    var shopIds = $(this.productPanel).find("input[name='shopIds']").val() ;
    var selectedBranchArray = new Array ;
    if(shopIds) selectedBranchArray = shopIds.split(",") ;
    $(this.productPanel).find("select[name='branches'] option").each(function(){
        if($.inArray($(this).attr("value"), selectedBranchArray) !== -1) $(this).attr("selected", "selected") ;
    }) ;
    
    var tagIds = $(this.productPanel).find("input[name='tagIds']").val() ;
    var selectedTagsArray = new Array ;
    if(tagIds) selectedTagsArray = tagIds.split(",") ;
    $(this.productPanel).find("select[name='tags'] option").each(function(){
        if($.inArray($(this).attr("value"), selectedTagsArray) !== -1) $(this).attr("selected", "selected") ;
    }) ;
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
汇总市场价
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.totalMarketPrice = function() {
    var marketPrice = 0 ;
    $(this.productPanel).find(".tabs .items tbody tr").each(function(){
        var mp = $(this).find("input[name='streetPrice']").val() ;
        if(mp) mp = $.trim(mp) ;
        if(mp) marketPrice += parseFloat(mp) ;
    }) ;
    $(this.productPanel).find(".tabs .items tfoot input[name='marketPrice']").val(marketPrice) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
汇总会员价
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.totalGuanaiPrice = function() {
    var guanaiPrice = 0 ;
    $(this.productPanel).find(".tabs .items tbody tr").each(function(){
        var gp = $(this).find("input[name='promotionPrice']").val() ;
        if(gp) gp = $.trim(gp) ;
        if(gp) guanaiPrice += parseFloat(gp) ;
    }) ;
    $(this.productPanel).find(".tabs .items tfoot input[name='guanaiPrice']").val(guanaiPrice) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
汇总礼卡价
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.totalVipPrice = function() {
    var vipPrice = 0 ;
    $(this.productPanel).find(".tabs .items tbody tr").each(function(){
        var vp = $(this).find("input[name='giftCardPrice']").val() ;
        if(vp) vp = $.trim(vp) ;
        if(vp) vipPrice += parseFloat(vp) ;
    }) ;
    $(this.productPanel).find(".tabs .items tfoot input[name='vipPrice']").val(vipPrice) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
实例化多文件上传组件：uploadify
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ProductController.prototype.initUploadify = function() {
    var classSelf = this ;
    var $fileUploaderContainer = $(this.productPanel).find(".modal-body .file-uploader") ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    先将原先的上传句柄干掉，免得重复实例化插件混淆不清
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $fileUploaderContainer.empty() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    重新再创建一个上传句柄并贴到相应位置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $fileUploaderContainer.append("<div id=\"queue\" data-amount-successful=\"0\" data-amount-errored=\"0\" data-related-successful=\"0\"></div>") ;
    var $fileUploader = $(document.createElement("INPUT")).attr("id", "fileUploader").attr("type", "file").attr("name", "files").attr("multiple", true) ;
    $fileUploaderContainer.append($fileUploader) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    然后再实例化插件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    require([this.parentClass.utilStaticPrefix + "/uploadify/jquery.uploadify.min.js"], function(){        
        $("#fileUploader").uploadify({
            buttonText : " + 上传图片" ,   //按钮上的文字内容            
            height  : 34,  //按钮的高度
            fileObjName : "files" ,  //文件域的name属性值
            fileSizeLimit : "1024KB" ,  //文件大小最大限制
            fileTypeExts : "*.jpg;*.jpeg;*.png" ,
            formData : {"category" :  "product"} ,
            swf : "/static/uploadify/uploadify.swf" ,
            uploader  : classSelf.parentClass.apiUrl.attachment.upload ,  //上传处理接口url            
            uploadLimit : 9 , //最多上传几个图片
            removeTimeout : 1 ,  // 	如果设置了任务完成后自动从队列中移除，则可以规定从完成到被移除的时间间隔。
            width  : 120 ,  //按钮的宽度
            onQueueComplete : function(queueData){
                /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
               将上传成功和上传失败图片数量记录在<div id="queue"></div>这个节点上
                -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $("#queue").attr("data-amount-successful", queueData.uploadsSuccessful).attr("data-amount-errored", queueData.uploadsErrored) ;                
            } ,
            onUploadSuccess : function(file, data, response) {
                /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
               注意，onUploadSuccess是每个图片成功上传都要触发一次！
                -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                var data = $.parseJSON(data) ;
                /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                往隐藏域里面添加上传好的图片的url
                -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                var fileUrlListArray = new Array ;
                $(data.result).each(function(){
                    fileUrlListArray.push(this.url) ;
                }) ;                  
                $(classSelf.productPanel).find(".modal-body input[name='logoUrl']").val(fileUrlListArray.join(",")) ;
                /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                同时要将缩略图展示出来
                -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/                
                $(classSelf.productPanel).find(".modal-body .uploaded-pict img").attr("src", fileUrlListArray[0]) ;
                $(classSelf.productPanel).find(".modal-body .uploaded-pict").show() ;
            }
        }) ;      
       
    }) ;
} ;