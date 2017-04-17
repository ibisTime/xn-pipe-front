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
    var myScroll, isEnd = false, isLoading = false, bannerArr = [];
    var newsListTmpl = __inline("../ui/news-list.handlebars");
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
    	$.when(
			getModuleAndBanner(),
			getNewsList(true)
        ).then(function () {
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
        });
    }
    function initSwiper(){
        new Swiper('#swiperInner', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
    }
    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyUpScroll({
        	loadMore: function () {
                getNewsList();
            },
            refresh: function () {
                isEnd = false;          
                getNewsList(true);
            }
        });
    }
    
    function getNewsList(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619085", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](newsListTmpl({items: list}));
                        config.start++;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无新闻</div>');
                        }
                        isEnd = true;
                        res.msg && base.showMsg(res.msg);
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无新闻</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    	
    }

    function getModuleAndBanner(){
        return Ajax.get("806052")
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html = "", bannerHtml = "";
                    $.each(data, function(i, d){
                        if(d.type == 2 && d.location == "index_banner"){
                            var pic = d.pic.split(/\|\|/)[0];
                            bannerHtml += "<div class='swiper-slide'><img  data-url= '"+d.url+"' class='wp100 banner show' src='" + base.getBannerPic(pic) +"'></div>";
                        }
                    });
                    $("#swiperInner .swiper-wrapper").html(bannerHtml);
                    initSwiper()
                }else{
                    base.showMsg(res.msg || "加载失败");
                }
            }, function () {
                base.showMsg("加载失败");
            });
    }
    
    
    function addListener() {
    	
    	
    	$("#swiperInner").on("touchstart", ".swiper-slide img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiperInner").on("touchend", ".swiper-slide img", function (e) {
            var me = $(this),
                touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if(Math.abs(xx) < 6){
                var url = me.attr('data-url');
                if(url)
                    location.href = url;
            }
        });

       
    }
});