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
    加载门店及体检套餐   
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选择地区事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.chooseAreaListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选择门店事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.storeClickListener();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选择页码事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.pageChangeListener();

    this.loadStoreAndService({
        pageIndex: 1,
        companyId: $("#companyId").val(),
        firstloadId: storeId
    });

    this.cliclkMap();
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
门店详情图片轮播   
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.rollImg = function() {

    var _this = this;
    /* require([_this.utilStaticPrefix + "/jquery.slide.min.js"], function() {

         if($(".inst-img-box .pagination li").size()>0)
         {
             // 初始化图片
             $(".inst-img-box").show().slide({
                 autoPlay: true,
                 titCell: ".pagination ul li",
                 effect: "leftLoop",
                 interTime: 4000,
                 vis: 1
             });
             $(".inst-img-box .pagination").addClass("opClass");
             //鼠标移到图片上才会显示底部的
             $(".inst-img-box,.inst-img-box .tempWrap").mouseover(function() {
                 $(".inst-img-box  .pagination").removeClass("opClass");
             })
             $(".inst-img-box,.inst-img-box .tempWrap").mouseout(function() {
                 $(".inst-img-box  .pagination").addClass("opClass");
             });
         }
     });*/
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
DetailsController.prototype.calculateHeight = function() {   //不执行
    var classSelf = this;
    //load完成之后,去计算store-list和service-list的高度，比较之后再设置两个div的高度
    var storeHeight = $(".store-list").outerHeight(),
        serviceHeight = $(".service-item").outerHeight();
    var termialHeight = storeHeight > serviceHeight ? storeHeight : serviceHeight;
    $(".store-service").height(termialHeight);
    $(".service-list").height(termialHeight);
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
门店及优惠检服务图片滚动
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.storeAndServiceSlide = function() {
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
    $("#areaselect").change(function() {
        var _this = $(this),
            areaId = _this.find("option:selected").attr("value"),
            page = 1;
        var data = {
            "areaId": areaId,
            "pageIndex": page,
            "companyId": $("#companyId").val()
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
            areaId = $("#areaselect").find("option:selected").attr("value"),
            page = $(".page .item").attr("data-currentpage"),
            totalpage = $(".page .item").attr("data-pages"),
            companyId = $("#companyId").val();
        if (_this.hasClass("prev")) {
            page = (page == 1 ? 1 : page - 1);
        } else if (_this.hasClass("next")) {
            page = (page == totalpage ? totalpage : parseInt(page) + 1);
        } else if (_this.hasClass("first")) {
            page = 1;

        } else if (_this.hasClass("end")) {
            page = totalpage;
        }

        $(".page .item").attr("data-currentpage", page);
        var data = {
            "areaId": areaId,
            "pageIndex": page,
            "companyId": companyId
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
    //$(".store-service").load("/company/shop/list", data, function() {
    classSelf.loadStore(data);
    classSelf.storeAndServiceSlide();
    classSelf.storeClickListener();

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
    //});
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载体检套餐 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.loadProduct = function(data) {
    //这里去更新该门店的对应的套餐   #tag
    var classSelf = this;
    var HtmlStr = '',
        len = data.result.length;
    if (len > 0) {
        var flag = 0;
        HtmlStr += '<div class="service-item">';
        if (len > 3) {
            HtmlStr += '<div class="controller prev"><i class="iconfont icon-fanhui"></i></div>';
            HtmlStr += '<div class="controller next"><i class="iconfont icon-xiangyou3"></i></div>';
        }
        HtmlStr += '<div class="content">';
        for (var i = 0; i < len / 3; i++) {
            HtmlStr += '<div class="item"><ul class="checkItemList">';
            for (var j = 0; j < 3; j++) {
                if (flag < len) {
                    var discountedPrice = data.result[flag].discountedPrice <= 0 ? '免费' : data.result[flag].discountedPrice;
                    var moneyIcon = data.result[flag].discountedPrice <= 0 ? '' : '<span class="money-icon">￥</span><span>';
                    HtmlStr += '<li><a href="/Html/GuanaihuiProduct/' + data.result[flag].productId + '.html?sid=' + storeId + '"><img src="' + setting.VAR_API_URL + data.result[flag].logo + 'list.jpg' + '" alt="' + data.result[flag].name + '" /><div class="item-price">';
                    HtmlStr += '<p>' + moneyIcon + discountedPrice + '</span></p><p><span class="money-icon">￥</span><span>' + data.result[flag].retailedPrice + '</span></p><p>查看详情</p></div>';
                    HtmlStr += '<div class="item-content"><h4>' + data.result[flag].name + '</h4><p>' + data.result[flag].productgroup + '</p></div></a></li>';
                }
                flag++;
            }
            HtmlStr += '</ul></div>';
        }
        //这里拼取底部滑动的nav
        if (len > 3) {
            HtmlStr += '</div><div class="pagination"><ul>';
            for (var i = 0; i < len / 3; i++) {
                var style = '';
                if (i == 0) {
                    style = 'class="on"';
                }
                HtmlStr += '<li ' + style + '></li>';
            }
            HtmlStr += '</ul></div></div>';
        }

        var $htmStr = $(HtmlStr);
        $(".service-list .service-item").remove();
        $(".service-list").append($htmStr);
        // classSelf.storeAndServiceSlide();

    } else {
        HtmlStr += '<div class="service-item"><ul class="checkItemList"><li class="empty"><a href="javascript:;"><img src="//dev18.guanaihui.cn/apps/www.guanaihui.com/css/images/institution-default.jpg" style="width:100%" /></a></li></ul></div>';
        var $htmStr = $(HtmlStr);
        $(".service-list .service-item").remove();
        $(".service-list").append($htmStr);
    }

};


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载门店
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.loadStore = function(data) {
    //这里去更新该门店的对应的套餐   #tag
    var classSelf = this;

    var store = stores.filter(function(item, index) {
        return ((!(data.areaId) || (item.AreaId == data.areaId)))
    });

    $("#totalcount").text("共" + store.length + "家门店");

    var totalpage = Math.ceil(store.length / 5);
    $(".page .item").attr("data-pages", totalpage);

    //只有一页不显示分页
    if (totalpage > 1) {
        $("div.page").show();
    } else {
        $("div.page").hide();
    }

    store = store.filter(function(item, index) {
        return (index >= ((data.pageIndex - 1) * 5) && index < ((data.pageIndex) * 5))
    });

    var HtmlStr = '',
        len = store.length;
    if (len > 0) {
        var flag = 0;

        //显示page计数 
        if (data.pageIndex > 1) {
            $("#currentpage").text((data.pageIndex - 1) * 5 + "-" + ((data.pageIndex - 1) * 5 + len));
            $(".store-list .page .item a.prev").removeClass("disabled");
        } else {
            $("#currentpage").text(1 + "-" + len);
            $(".store-list .page .item a.prev").addClass("disabled");
        }
        if (data.pageIndex == totalpage) {
            //末页设置下一页不可用
            $(".store-list .page .item a.next").addClass("disabled");

            //如果不止一页,到末页点亮
            if (data.pageIndex > 1) {
                $(".store-list .page .item a.first ").removeClass("on");
                $(".store-list .page .item a.end ").addClass("on");
            } else //只有一页,取消显示
            {
                $("div.page").hide();
                // $(".store-list .page .item a.end ").removeClass("on");
                // $(".store-list .page .item a.first ").addClass("on");
            }


        } else {
            $(".store-list .page .item a.next").removeClass("disabled");

            //第一页设置首页点亮
            if (data.pageIndex == 1) {
                $(".store-list .page .item a.end ").removeClass("on");
                $(".store-list .page .item a.first ").addClass("on");
            } else {
                $(".store-list .page .item a.end ").removeClass("on");
                $(".store-list .page .item a.first ").removeClass("on");
            }
        }

        for (var j = 0; j < len; j++) {
            var firston = (j == 0 ? ' active ' : '');
            HtmlStr += "<div class='store-item" + firston + "' data-id='" + store[j].StoreId + "' data-name='" + store[j].StoreName + "' data-address='" + store[j].Address + "' data-longitude='" + store[j].Longitude + "' data-latitude='" + store[j].Latitude + "' data-busTips='" + store[j].BusTips + "' data-subwayTips='" + store[j].Subway + "' data-parkingDetail='" + store[j].Park + "'> <dl><dt><h3>" + store[j].StoreName + "</h3><p>" + store[j].Address + "<i data-toggle='modal' class='iconfont'>&#xe804;</i></p></dt><dd><p>营业时间 : " + store[j].Nonworkdays + " </p><p>抽血时间 : " + store[j].BloodTime + "</p></dd></dl></div>"
        };

        var $htmStr = $(HtmlStr);
        $(".store-list .store-item").remove();
        $(".store-list").prepend($htmStr);
        $(".store-service").attr("style", "");
        $(".store-list").attr("style", "");

        var storeHeight = $(".store-list").outerHeight() + 40;
        $(".store-list").height(storeHeight);

        //第一次载入该页面,获取Sid对应门店信息
        if (data.firstloadId) {
            storeId = data.firstloadId;
            store = stores.filter(function(item, index) {
                return item.StoreId == storeId;
            });
            $(".store-item:not(.active)[data-id=" + storeId + "]").addClass("active").siblings(".store-item").removeClass("active");
        }

        if (store[0]) {
            storeId = store[0].StoreId;
            classSelf.loadProduct({
                result: store[0].Products
            });
        }

    } else {
        // HtmlStr += '<div class="service-item"><ul class="checkItemList"><li class="empty"><a href="javascript:;"><img src="//dev18.guanaihui.cn/apps/www.guanaihui.com/css/images/institution-default.jpg" style="width:100%" /></a></li></ul></div>';
        // var $htmStr = $(HtmlStr);
        // $(".service-list .service-item").remove();
        // $(".service-list").append($htmStr);

        var $htmStr = $(HtmlStr);
        $(".store-list .store-item").remove();

    }
};



/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
点击门店，获取相应的服务 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.storeClickListener = function() {

    var classSelf = this;
    $("body").off("click", ".store-item:not(.active)").on("click", ".store-item:not(.active)", function() {
        var _this = $(this);
        storeId = _this.attr("data-id");
        _this.addClass("active").siblings(".store-item").removeClass("active");

       
        // 创建地图
        /*var mapData = {
            name: _this.attr("data-name"),
            address: _this.attr("data-address"),
            longitude: _this.attr("data-longitude"),
            latitude: _this.attr("data-latitude"),
            busTips: _this.attr("data-busTips"),
            subwayTips: _this.attr("data-subwayTips"),
            parkingDetail: _this.attr("data-parkingDetail")
        };*/

        //data

        //classSelf.createMap(mapData);
        var store = stores.filter(function(item, index) {
            return item.StoreId == storeId;
        });
        if (store[0]) {
            storeId = store[0].StoreId;
            classSelf.loadProduct({
                result: store[0].Products
            });
            classSelf.storeAndServiceSlide();
        }
        // param.prorcess(data);
        //classSelf.request("/company/prod/data", data, param);
    });

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
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建地图标记   
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
DetailsController.prototype.createMap = function(data) {
        var classSelf=this;

        // 地图信息样式
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

DetailsController.prototype.cliclkMap=function(){
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
     类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(function() {
    new DetailsController;
});
