/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：booking(预约页面)
 3. 作者：雷朗峰(leilangfeng@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function IndexFn() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    机构页面初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.mechanismFn();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    预约服务初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.serviceFn();

};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1、机构详情初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexFn.prototype.mechanismFn = function() {

    var classSelf = this;
    var longitude = null; 	//经度
    var latitude = null;	//纬度
    var shopId ;			//门店ID	
    var companyId ;		//机构ID 	

    //获取url地址里面的参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null){
	     	return  unescape(r[2]);
	     } else{
	     	return null;
	     }
	}		
	shopId = GetQueryString("s");		//机构ID 		
	companyId = GetQueryString("c");	//门店ID

	var myUrl = classSelf.companyUrl+companyId;  //接口地址
	$.ajax({
			type: "get",
			url: myUrl,
			dataType: "jsonp",
			data:{
					"shopId":shopId,			//门店ID
					"areaId":38,		//区域ID
	      			"longitude":longitude,	//经度
	      			"latitude":latitude		//纬度
	      		},
	  		jsonp:"callback",
			success: function (res) {
				var data = res.result;  //返回Json 
				var banner = '';		// banner区域
				var mechanism = '';		//体检机构地址详情
				var service = '';		//预约服务
				var imgShow = '';		//图片展示

				var ImgNum = 0;			//图片的数量
				var VedioNum = 0;		//视频的数量	
				var storeStatus = '';   //店铺状态	
				var AppPop = '';		//banner展示图片

				//1、banner区域
				$.each(data.companyDetail.resourceList, function(index, item) {
					//计算图片、视频的数量
					if (item.resouceType === 'Img') {
						ImgNum++;
					}else if (item.resouceType === 'Vedio') {
						VedioNum++;
					};
					//banner展示图片
					if (item.profileType === 'AppPop') {
						AppPop = item.resourceValue;
					};
				});

				banner +=	'<img src="'+AppPop+'">'+
							'<div class="pOut" >'+
							'<p class="pLeft"><em></em><span>'+ ImgNum +'</span></p>'+
							'<p class="pRight"><em></em><span>'+ VedioNum +'</span></p>'+
							'</div>'
	        	$('.banner').prepend(banner);

	        	//2、体检机构地址详情
	        	//店铺状态
	        	if (data.companyDetail.grade === '0') {
	        		storeStatus = '未入驻';
	        	}else{
	        		storeStatus = '已入驻';
	        	}
	        		
				mechanism +='<div class="name"><h2>'+data.companyDetail.companyName+'</h2><span class="blue-span">'+data.companyDetail.shopCount+'店</span><span class="yellow-span">'+storeStatus+'</span>'+
							'</div>'+
							'<div class="address">'+
							'<h2>'+data.companyDetail.shopName+'</h2>'+
							'<p><span>营业时间：</span><em class="time">'+data.companyDetail.businessHours+'</em></p>'+
							'<p><span>营业地址：</span><em class="add">'+ data.companyDetail.shopAddress+'</em><i class="iNumber"></i></p>'+
							'</div>'
				$('.mechanism').prepend(mechanism);

				//判断地址距离是否为null
	        	if (data.companyDetail.distance == null) {
	        		$('.iNumber').html('');
	        	}else{
	        		if (data.companyDetail.distance > 1000) {
	        			$('.iNumber').html((data.companyDetail.distance/1000)+'km');
	        		}else{
	        			$('.iNumber').html(data.companyDetail.distance+'m');
	        		}
	        	}
	        	//3、机构简介图片
	        	$.each(data.companyDetail.resourceList, function(index, item) {
					if (item.profileType === 'AppDetail') {
						imgShow += '<li><img src="'+item.resourceValue+'"></li>'
					};
				});
	        	$('.imgShow').prepend(imgShow);	
	        },
	        error: function(error) {
	        	console.log('error!');
	        }	
	});	
		 
    
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
2、预约服务初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexFn.prototype.serviceFn = function() {
	var classSelf = this;
	var shopId = 40110;
	//获取url地址里面的参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null){
	     	return  unescape(r[2]);
	     } else{
	     	return null;
	     }
	}		
	shopId = GetQueryString("s");		//机构ID 
	
    var myUrl = classSelf.listFromShopUrl+shopId;
    $.ajax({
		type: "get",
		url: myUrl,
		dataType: "jsonp",
      	jsonp:"callback"	,
		success: function (res) {
			var data = res.result;  //返回Json
			//预约服务
			var service = '';
			
			$.each(data.productList, function(index, item) {
				service += 	'<li>'+
							'<div class="imgLeft"><img src="'+item.logo+'" ></div>'+
							'<div class="imgRight"><h3>'+item.name+'</h3><span>已预约'+item.salesCount+'次</span><p><em>¥'+item.cardPrice+'</em><del>¥'+item.retailedPrice+'</del></p></div>'+
							'<a class="myBtn" href="productdetail.html?p='+item.productId+'&s='+shopId+'">查看详情</a>'+
							'</li>'
			});
			$('.serviceList').prepend(service);
			if(data.productList.length>3){
				//点击查看更多
				$('#more').show();
				$('#more').click(function(event) {
					$(this).hide();
					$('.serviceList li').show();
				});
			}else{
				$('#more').hide();
			}
			
        },
        error:function(error){
        	console.log('error!');
        }		
	});	
	


};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexFn;
});
