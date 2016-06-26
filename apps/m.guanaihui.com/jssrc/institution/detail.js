/*
 1. 项目名称：m.360guanai.com
 2. 页面名称：服务详情页(M站)
 3. 作者：songlindan
*/

function MzDetailController(){
    // 继承Controller
    Controller.call(this);
    
    this.ajaxFill();
};

MzDetailController.prototype.ajaxFill = function(){

    var classSelf = this;
    var longitude = null;
    var latitude  = null;
    var productId;
    

    function GetQueryString(name){  
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r !=null) {
            return window.unescape(r[2]);
        } else {
            return null;
        } 
    }
    productId = GetQueryString("p");
    shopId = GetQueryString("s");       
    
    var ajaxURL = classSelf.detailUrl+productId;
    $.ajax({
        url: ajaxURL,
        dataType: 'JSONP',
        data: {
            "productId" : productId,     //商品id
            "areaId" : 38,     //区域id
            "shopId":shopId,
            "longitude" : longitude,   //经度 obj.longitude
            "latitude"  : latitude    //纬度 obj.latitude 
        },
        success: function(res) {
            var data = res.result;  //返回Json 
            var banner  = '';   //banner区域html
            var medical = '';   //体检详细地址区域html
            var service = '';   //服务明细区域html
            var notice  = '';   //预约须知详情html

            var shopState = ''; //店铺入驻状态

             //banner区域
            banner  +=  '<div class="bannerImg">'+
                        '<img src="'+data.product.productLogo+'">'+
                        '<div class="bannerCon">'+
                        '<h3>'+ data.product.productName +'</h3>'+
                        '<p>'+ data.product.description +'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="priceCon"><span >￥'+data.product.discountedPrice+'</span><s>￥'+data.product.retailedPrice+'</s></div>'
            $('.bannerWrap').append(banner);
            //瑞慈体检详细地址区域
            //判断店铺状态
            if (data.product.grade == '0') {
                shopState = '未入驻';
            }else{
                shopState = '已入驻';
            };

            medical +=  '<div class="medicalName">'+
                         '<h4>'+data.product.companyName+'</h4>'+'<span class="shopTitle">'+data.product.shopCount+'店</span>'+
                         '<span class="inShopTitle">'+shopState+'</span>'+
                         '<div class="button">'+
                         '<a href="companydetail.html?s='+data.product.shopId+'&c='+data.product.companyId+'">查看机构'+'<i></i>'+'<em></em>'+'</a>'+ 
                         '</div>'+   
                         '</div>'+
                         '<div class="medicalDec">'+
                         '<h3>'+data.product.shopName+'</h3>'+
                         '<p class="pAddress">'+
                         '<i>营业时间：</i>'+
                         '<em style="width:100%;">'+data.product.businessHours+'</em>'+
                         '</p>'+
                         '<div class="pAddress">'+
                         '<i>营业地址：</i>'+
                         '<em>'+data.product.shopAddress+'</em>'+
                         '<span class="medicalDecMin">'+data.product.distance+'km</span>'+
                         '</div>'+
                         '</div> '
            $('.medicalCon').append(medical);

            //判断店铺距离是否为空
            if (data.product.distance == null) {
                $('.medicalDecMin').html('');
            } else {
                if (data.product.distance > 1000 ) {
                    $('.medicalDecMin').html(data.product.distance/1000 + 'km');
                } else {
                    $('.medicalDecMin').html(data.product.distance + 'm');  
                }          
            }

             // 服务明细列表详情
            service += '<h4>服务明细</h4>'+
                        '<ul class="detailConUl">';
                        $.each(data.product.itemList, function(index, el) {
                            service += '<li>'+
                                       '<span>'+el.name+'</span><span>'+el.serviceCount+'次</span><span>￥'+el.price+'</span>'+
                                       '</li>'; 
                        });                                                                             
                        
            service += '</ul>'+
                        '<ul class="detailConTitle">'+
                        '<li>'+'<span>总价值</span>'+'<span>￥'+data.product.retailedPrice+'</span>'+'</li>'+
                        '<li>'+'<span>预约价</span>'+'<span class="titleLast">￥'+data.product.discountedPrice+'</span>'+'</li>'+
                        '</ul>' ;

            $('.detailCon').append(service);
             //预约须知详情
            notice  +=  '<h4 class="detOrder">预约须知</h4>'+
                        '<ul class="orderConUl">';
                        $.each(data.product.noteList, function(index, items) {
                            notice  +=  '<li>'+
                                        '<span class="time"></span>'+
                                        '<div class="divTime">'+
                                        '<span >'+items.content+'</span>'+                    
                                        '</div>'+
                                        '</li>';  
                          });
            notice  += '</ul>';

            $('.orderCon').append(notice);      
            
        }                   
    });
}

/*---------类的初始化-------------------------------------------------*/
$(function() {
    new MzDetailController;
});


