define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'swiper',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, Handlebars, loading, Swiper, citySelect, scroll) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    var config = {
        start: 1,
        limit: 10,
        status: "1"
    }, citylist;

    init();

    function init() {
        Foot.addFoot(0);
        initIScroll();
        base.initLocation(initConfig, getInitData);
        addListener();
    }
    function initConfig(result) {
        citylist = result;
        citySelect.addCont({
            cityList: citylist,
            success: function (city) {
                $("#headDW").text(city);
            }
        });
        getInitData();
    }
    function getInitData() {
        loading.createLoading();

        initSwiper();

        loading.hideLoading();
    }
    function initSwiper(){
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
    }
    function initIScroll(){
        scroll.init();
    }

    function getModuleAndBanner(){
        return Ajax.get("806052")
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html = "", bannerHtml = "";
                    $.each(data, function(i, d){
                        if(d.type == 3 && d.location == "home_page"){
                            var url = d.url;
                            if(/^page:/.test(url)){
                                url = url.replace(/^page:/, "../")
                                         .replace(/\?/, ".html?");
                                if(!/\?/.test(url)){
                                    url = url + ".html";
                                }
                            }
                            html +='<li class="nav-li nav-li-4">'+
                                    '<a class="wp100 show" href="'+url+'">'+
                                        '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                        '<div class="nav-li-text">'+d.name+'</div>'+
                                    '</a>'+
                                '</li>';
                        }else if(d.type == 2 && d.location == "index_banner"){
                            var pic = d.pic.split(/\|\|/)[0];
                            bannerHtml += '<div class="swiper-slide"><img class="wp100 hp100" src="' + base.getPic(pic) +'"></div>';
                        }
                    });
                    $("#module").html(html);
                    $("#swiperInner").find(".swiper-wrapper").html(bannerHtml);
                    initSwiper();
                }else{
                    base.showMsg(res.msg || "加载失败");
                }
            }, function () {
                base.showMsg("加载失败");
            });
    }
    function addListener() {
        // $("#headDW").on("click", function (e) {
        //     e.stopPropagation();
        //     citySelect.showCont();
        // });
        // $("#searchInput").on("keyup", function () {
        //     var _self = $(this);
        //     var val = _self.val();
        //     if(!val)
        //         _self.siblings(".index-search-placeholder").show();
        //     else
        //         _self.siblings(".index-search-placeholder").hide();
        // });
        // $("#searchIcon").on("click", function () {
        //     location.href = "../home/search.html?name=" + $("#searchInput").val();
        // });
    }
});