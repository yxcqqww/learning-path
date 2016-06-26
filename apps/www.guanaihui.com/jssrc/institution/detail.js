/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：details(套餐列表)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function DetailsController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     页面顶部全部服务分类下拉
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     回到页面顶部以及在线咨询两个按钮的浮动条
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.floater();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     门店详情图片轮播
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.rollImg();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     选择地区事件监听
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.chooseAreaListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     加载门店及体检套餐
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.loadStoreAndService({
        companyId: $("#companyId").val(),
        shopId: $("#shopId").val()
    });

    this.cliclkMap();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();
    this.fixPo();
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 门店详情图片轮播
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.rollImg = function() {
    var _this = this;
    $('.slider-for').slick({
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.slider-nav',
        prevArrow: '<a href="javascript:;" class="prev"><i class="iconfont icon-fanhui"></i></a>',
        nextArrow: '<a href="javascript:;" class="next"><i class="iconfont icon-xiangyou3"></i></a>'
    });

    var flag = $(".slider-for img").size() > 5 ? true : false;
    if (flag) {
        $(".slider-nav img").css("height", "60px");
    } else {
        $(".slider-nav img").attr("style","width:100px !important");
    }
    $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: false,
        arrows: false,
        focusOnSelect: true,
        centerMode: flag
    });
    $(".slider-nav").addClass("opClass");
    $(".slick-arrow").addClass("opClass");
    $(".slider-for,.slider-nav").mouseover(function() {
        $(".slider-nav").removeClass("opClass");
        $(".slick-arrow").removeClass("opClass");
    })
    $(".slider-for,.slider-nav").mouseout(function() {
        $(".slider-nav").addClass("opClass");
        $(".slick-arrow").addClass("opClass");
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 计算门店或者服务的高度
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.calculateHeight = function() {
    var classSelf = this;
    //load完成之后,去计算store-list和service-list的高度，比较之后再设置两个div的高度
    var storeHeight = $(".store-list").outerHeight() + 40,
        serviceHeight = $(".service-item").outerHeight();
    var termialHeight = storeHeight > serviceHeight ? storeHeight : serviceHeight;
    //termialHeight = termialHeight > 327 ? 327 : termialHeight;
    $(".store-service").height(termialHeight);
    //$(".store-list").height(termialHeight);
    $(".service-list").height(termialHeight);
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 门店及优惠检服务图片滚动
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.storeAndService = function() {
    var classSelf = this;
    require([classSelf.utilStaticPrefix + "/jquery.slide.min.js"], function() {
        // 初始化图片
        $(".service-item").slide({
            autoPlay: false,
            titCell: ".pagination ul li",
            effect: "leftLoop",
            interTime: 4000,
            vis: 1
        });
        classSelf.calculateHeight();
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 选择地区事件监听
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.chooseAreaListener = function() {
    var classSelf = this;
    $(".select-area").change(function() {
        var _this = $(this),
            araeId = _this.find("option:selected").attr("value");
        //page = $(".store-list .page .item a.on").attr("data-index");
        var data = {
            "areaId": araeId,
            "pageIndex": 1,
            "companyId": $("#companyId").val(),
            "shopId": $("#shopId").val()
        };
        classSelf.loadStoreAndService(data);
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 分页事件监听
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.pageChangeListener = function() {
    var classSelf = this;
    //分页也一样，重新load这块内容
    $(".store-list .page .item a").click(function() {
        var _this = $(this),
            araeId = $(".select-area").find("option:selected").attr("value"),
            page = _this.attr("data-index"),
            companyId = $("#companyId").val();
        var data = {
            "areaId": araeId,
            "pageIndex": page,
            "companyId": companyId,
            "shopId": $("#shopId").val()
        };
        classSelf.loadStoreAndService(data);
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 加载门店及体检套餐
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.loadStoreAndService = function(data) {
    var classSelf = this,
        data = data || {};
    data["isPrev"] = $(".store-service").attr("data-flag") === "prev" ? true : false;
    $(".store-service").load("/company/shop/list", data, function() {
        classSelf.storeAndService();
        classSelf.storeClickListener();
        classSelf.pageChangeListener();
        var mapData = {};
        if ($(".store-item").length > 0) {
            var $activeStore = $(".store-item.active");
            mapData.name = $activeStore.attr("data-name");
            mapData.address = $activeStore.attr("data-address");
            mapData.longitude = $activeStore.attr("data-longitude");
            mapData.latitude = $activeStore.attr("data-latitude");
            mapData.busTips = $activeStore.attr("data-busTips");
            mapData.subwayTips = $activeStore.attr("data-subwayTips");
            mapData.parkingDetail = $activeStore.attr("data-parkingDetail");
        };

        classSelf.createMap(mapData);
        console.log("Load was performed.");
    });
};


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 点击门店，获取相应的服务
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.storeClickListener = function() {
    var classSelf =this;
    $("body").off("click", ".store-item:not(.active)").on("click", ".store-item:not(.active)", function() {
        var _this = $(this),
            storeId = _this.attr("data-id");
        _this.addClass("active").siblings(".store-item").removeClass("active");
        var data = {
            "shopId": storeId,
            "companyId": $("#companyId").val()
        };
        $(".service-list").load("/company/prod/data",data,function(){
            classSelf.storeAndService();
        });
        
    });

};
DetailsController.prototype.cliclkMap=function(){
    var classSelf=this;

    $(".special-service").on("click",".store-item dt p i", function() {
        var $e = $(this);
        $('#myModal').on('shown.bs.modal', function (e) {
            var $storeItem = $e.closest('.store-item');

            // 创建地图
            var mapData = {
                name: $storeItem.attr("data-name"),
                address: $storeItem.attr("data-address"),
                longitude: $storeItem.attr("data-longitude"),
                latitude: $storeItem.attr("data-latitude"),
                busTips: $storeItem.attr("data-busTips"),
                subwayTips: $storeItem.attr("data-subwayTips"),
                parkingDetail: $storeItem.attr("data-parkingDetail")
            };
            classSelf.createMap(mapData);
        });
        $("#myModal").modal();
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 创建地图标记
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.createMap = function(data) {
    // 地图信息样式
    //var dlStyle = 'class="clear-fix"';
    var classSelf = this;

    point = new BMap.Point(data.longitude, data.latitude);
    map = new BMap.Map("baiduMapContainer"); //Map实例
    map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别

    marker = new BMap.Marker(point); // 在指定的经纬度地方打图钉
    map.addOverlay(marker); // 将图钉添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);

    var infoWindow = new BMap.InfoWindow(
        "\
        <dl>\
            <dt>机构：</dt>\
            <dd>" + data.name + "</dd>\
            </dl>\
            <dl>\
                <dt>地址：</dt>\
                <dd>" + data.address + "</dd>\
            </dl>\
            <dl>\
                <dt><img src ="+classSelf.staticDomain+"/apps/www.guanaihui.com/css/images/icon-park.jpg></dt>\
                <dd>" + data.parkingDetail + "</dd>\
            </dl>\
            <dl>\
                <dt><img src ="+classSelf.staticDomain+"/apps/www.guanaihui.com/css/images/icon-metro.jpg></dt>\
                <dd>" + data.subwayTips + "</dd>\
            </dl>\
             <dl>\
                <dt><img src ="+classSelf.staticDomain+"/apps/www.guanaihui.com/css/images/icon-bus.jpg></dt>\
                <dd>" + data.busTips + "</dd>\
            </dl>\
            ", {
            padding: 10,
            width: 320
        }
    ); // 创建信息窗口对象

    marker.addEventListener("click", function() {
        this.openInfoWindow(infoWindow);
    });
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    //map.setCurrentCity(city);          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(false); //开启鼠标滚轮缩放
    map.addControl(new BMap.NavigationControl());
    //var opts = {offset: new BMap.Size(150, 5)}
    //map.addControl(new BMap.ScaleControl(opts));
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());

    map.panTo(point);
}

/*top栏获取一些东西*/
DetailsController.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 锚点导航固定JS
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 
 DetailsController.prototype.fixPo=function(){
    if(!!$('.template-nav')[0]){
        var scrollFn=function(event) {
            if((!!$('.template-body .tl-box').eq(6)[0] && $(this).scrollTop()<=$('.template-body .tl-box').eq(6).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(5).offset().top-80) || $('.template-body .tl-box').eq(5)[0] && $(this).scrollTop()>=$('.template-body .tl-box').eq(5).offset().top-50){
                $('.template-nav li').eq(5).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if((!!$('.template-body .tl-box').eq(5)[0] && $(this).scrollTop()<=$('.template-body .tl-box').eq(5).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(4).offset().top-80) || $('.template-body .tl-box').eq(4)[0] && $(this).scrollTop()>=$('.template-body .tl-box').eq(4).offset().top-50){
                $('.template-nav li').eq(4).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if((!!$('.template-body .tl-box').eq(4)[0] && $(this).scrollTop()<=$('.template-body .tl-box').eq(4).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(3).offset().top-80) || $('.template-body .tl-box').eq(3)[0] && $(this).scrollTop()>=$('.template-body .tl-box').eq(3).offset().top){
                $('.template-nav li').eq(3).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if(!!$('.template-body .tl-box').eq(3)[0] && $(this).scrollTop()<=$('.template-body .tl-box').eq(3).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(2).offset().top-80){
                $('.template-nav li').eq(2).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if($(this).scrollTop()<=$('.template-body .tl-box').eq(2).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(1).offset().top-80){
                $('.template-nav li').eq(1).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if($(this).scrollTop()<=$('.template-body .tl-box').eq(1).offset().top && $(this).scrollTop()>=$('.template-body .tl-box').eq(0).offset().top-80){
                $('.template-nav li').eq(0).addClass('in').siblings('li').removeClass('in');
                $('.template-nav').addClass('fixName');
            }else if($(this).scrollTop()>=$('.template-body .tl-box').eq(0).offset().top){
                $('.template-nav').addClass('fixName');
                /*$('.template-body .tl-box').eq(0).css('margin-top','30px');*/
                $('.template-nav li').eq(0).addClass('in').siblings('li').removeClass('in');
            }else{
                $('.template-nav').removeClass('fixName');
            };
        }
        $(window).scroll(scrollFn);
        var currentTure=true;
        $('.template-nav li').click(function(event){
            $(window).unbind('scroll');
            $(this).addClass('in').siblings('li').removeClass('in');
            var curIndex=$(this).index();
            console.log($('.template-body .tl-box').eq(curIndex).offset().top);
            if($('.template-nav').hasClass('fixName')){
                if(curIndex==0){
                    var topIndex=$('.template-body .tl-box').eq(curIndex).offset().top-20;
                    $('body,html').animate({'scrollTop':topIndex},500,function(){
                        $(window).bind('scroll',scrollFn);
                    });
                }else{
                    var topIndex=$('.template-body .tl-box').eq(curIndex).offset().top-50;
                    $('body,html').animate({'scrollTop':topIndex},500,function(){
                        $(window).bind('scroll',scrollFn);
                    });
                }
            }else{
                
                currentTure=true;
                if(currentTure){
                    var topIndex=$('.template-body .tl-box').eq(curIndex).offset().top-100;
                    $('body,html').animate({'scrollTop':topIndex},500,function(){
                        $(window).bind('scroll',scrollFn);
                    });
                    currentTure=false;
                }else{
                    var topIndex=$('.template-body .tl-box').eq(curIndex).offset().top-50;
                    $('body,html').animate({'scrollTop':topIndex},500,function(){
                        $(window).bind('scroll',scrollFn);
                    });
                } 
            }   
        });
    }
 }
$(document).ready(function() {
    new DetailsController;
});