/*
 * @Author: Administrator
 * @Date:   2016-03-14 18:16:18
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-04-13 11:10:16
 */

function introduction() {

    Controller.call(this);

    this.calculateHeight();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     页面顶部全部服务分类下拉
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选择页码事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.pageChangeListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选择页码事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.chooseAreaListener();

    this.storeClickListener();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击加载地图
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.cliclkMap();
    this.loadStoreAndService({
        companyId: $("#companyId").val(),
        shopId: $("#shopId").val()
    });


    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        热门机构选择
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    top 栏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.ajaxSet();

};
/*top栏获取一些东西*/
introduction.prototype.ajaxSet=function(){
    $.ajaxSetup ({ 
        cache: false 
    });
    $(".topper-service").load('/personal/toper/count', function(data){
    });
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 计算门店或者服务的高度
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
introduction.prototype.calculateHeight = function() {
    var classSelf = this;
    //load完成之后,去计算store-list和service-list的高度，比较之后再设置两个div的高度
    var storeHeight = $(".store-list").outerHeight() + 40,
        serviceHeight = $(".service-item").outerHeight();
    var termialHeight = storeHeight > serviceHeight ? storeHeight : serviceHeight;
    termialHeight = termialHeight > 327 ? 327 : termialHeight;
    $(".store-service").height(termialHeight);
    //$(".store-list").height(termialHeight);
    $(".service-list").height("auto");
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 门店及优惠检服务图片滚动
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
introduction.prototype.storeAndService = function() {
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
introduction.prototype.chooseAreaListener = function() {
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
introduction.prototype.pageChangeListener = function() {
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
introduction.prototype.loadStoreAndService = function(data) {
    var classSelf = this,
        data = data || {};
    data["isPrev"] = $(".store-service").attr("data-flag") === "prev" ? true : false;
    $(".store-service").load("/company/shop/list/non", data, function() {
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
introduction.prototype.storeClickListener = function() {
    var classSelf =this;
    $("body").off("click", ".store-item:not(.active)").on("click", ".store-item:not(.active)", function() {
        var _this = $(this),
            storeId = _this.attr("data-id");
        _this.addClass("active").siblings(".store-item").removeClass("active");
        var data = {
            "shopId": storeId,
            "companyId": $("#companyId").val()
        };
        // 创建地图
        var mapData = {
            name: _this.attr("data-name"),
            address: _this.attr("data-address"),
            longitude: _this.attr("data-longitude"),
            latitude: _this.attr("data-latitude"),
            busTips: _this.attr("data-busTips"),
            subwayTips: _this.attr("data-subwayTips"),
            parkingDetail: _this.attr("data-parkingDetail")
        };
        classSelf.createMap(mapData);
        //classSelf.request("/company/prod/data", data, param);
        $(".service-list").load("/company/prod/data",data);
    });
};
introduction.prototype.cliclkMap=function(){
    var classSelf=this;

    $(".special-service").on("click",".store-item dt p i", function() {
        var $e = $(this);
        $('#myModal').on('shown.bs.modal', function (e) {
            var $storeItem = $e.closest('.store-item');
            console.log($storeItem);

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
introduction.prototype.createMap = function(data) {
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
$(document).ready(function() {
    new introduction;
});
