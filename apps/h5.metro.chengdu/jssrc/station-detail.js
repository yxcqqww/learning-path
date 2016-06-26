
function StationDetailController(){

    Controller.call(this);

    this.swipeBanner();
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    地铁图
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
StationDetailController.prototype.swipeBanner = function() {
    require([this.utilStaticPrefix + "/swiper/dist/js/swiper.min.js"], function(){
        var swiper = new Swiper("#info-imgs", {
            pagination : ".swiper-pagination" ,
            slideClass:"swiper-slide",
            paginationClickable : true ,
            spaceBetween : 30 ,
            centeredSlides : true ,
            //autoplay : 5000 ,
            autoplayDisableOnInteraction : false
        }) ;
    }) ;
} ;

$(document).ready(function(){
    new StationDetailController;
});