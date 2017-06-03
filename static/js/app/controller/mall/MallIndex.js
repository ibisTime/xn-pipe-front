define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'swiper',
    'app/module/loadImg/loadImg',
    'app/module/foot/foot',
], function(base, Ajax, dict, Swiper, loadImg, Foot) {

    var isEnd = false,
        canScrolling = false;
    var indexTopImg = dict.get("indexTopImg");
    var imgWidth = (($(window).width() - 20) / 2 - 8) + "px";

    var config = {
        "status": "3",
        "start": 1,
        "limit": 10,
        companyCode: COMPANY_CODE,
        location: "1"
    };

    init();
    Foot.addFoot(false);
    getModuleAndBanner();
    //banner图

    function getModuleAndBanner(){
        return Ajax.get("806052")
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html = "", bannerHtml = "";
                    $.each(data, function(i, d){
                        if(d.type == 2 && d.location == "mall_banner"){
                            var pic = d.pic.split(/\|\|/)[0];
                            bannerHtml += "<div class='swiper-slide'><img  data-url= '"+d.url+"' class='wp100 banner' src='" + base.getBannerPic(pic) +"'></div>";
                        }
                    });
                    $("#top-swiper").html(bannerHtml);
                    initSwiper();
                }else{
                    base.showMsg(res.msg || "加载失败");
                }
            }, function () {
                base.showMsg("加载失败");
            });
    }


    function initSwiper(){
	   	var mySwiper = new Swiper('#swiper-container', {
	        'direction': 'horizontal',
	        'autoplay': 2000,
	        'autoplayDisableOnInteraction': false,
	        // 如果需要分页器
	        'pagination': '.swiper-pagination'
	    });
   }

    function init() {
        addListeners();

        var param = {
            "parentCode": "0",
            "status": "1",
            "type": "1",
            companyCode: COMPANY_CODE
        };
        $.when(
            //获取大类的数据字典
            Ajax.post("808007", {json: param}),
            //获取产品信息
            getPageProduct(true)
        ).then(function(res1) {
            if (res1.success) {
                var list1 = res1.data;
                //    遍历大类
                $.each(list1, function(i, val) {
                    var pic1 = val.pic,
                        name1 = val.name,
                        code1 = val.code;

                    var html1 = '<div class="wp20 plr10 mb4 p-r pb1_6em"><div><img src="' + base.getImg(pic1) + '" alt=""></div><p class="s_10 fenlei-p">' + name1 + '</p></div>';
                    html1 = $(html1);
                    html1.on("click", function() {
                        location.href = "./mall_list.html?c=" + code1;
                    })
                    $("#classOne").append(html1)
                });
            }else{
            	base.showMsg(res1.msg)
            }
        });
    }
    function getPageProduct(refresh){
        config.start = refresh && 1 || config.start;
        return Ajax.get("808025", config, !refresh)
            .then(function(res){
                if(res.success){
                    var html = "";
                    $.each(res.data.list, function(i, val) {
                        var pic2 = val.advPic,
                            name = val.name,
                            slogan = val.slogan,
                            originalPrice = val.originalPrice
                                ? val.originalPrice / 1000
                                : "",
                            price2 = val.price2
                                ? base.formatMoney(val.price2) + "菜狗币"
                                : "",
                            price3 = val.price3
                                ? base.formatMoney(val.price3) + "积分"
                                : "",
                            price1 = val.price1
                                ? base.formatMoney(val.price1) + "元"
                                : "" ,  
                            code = val.code;

                        html += '<li class="ptb8 clearfix b_bd_b plr10"><a class="show p_r min-h100p" href="../mall/buy.html?code=' + code + '"><div class="order-img-wrap tc"><img class="center-img1" src="' + PIC_PREFIX + pic2 + '"></div><div class="order-right-wrap clearfix"><p class="t_323232 s_12 line-tow">' + name + '</p><p class="t_999 s_10 line-tow">' + slogan + '</p><p class="t_red"><span class="s_10 t_40pe">' + price3+'/'+ price1+ '</span></p><p class="s_10 t_through">市场参考价：<span>' + originalPrice + '</span>元</p></div></a></li>';
                    })
                    $("#contUl").append(loadImg.loadImg(html));
                    if(config.limit > res.data.list.length || config.limit >= res.data.totalCount){
                        isEnd = true;
                    }else{
                        config.start++;
                    }
                }else{
                    base.showMsg(res.msg);
                }
            });
    }
    function addListeners() {
        $("#searchIcon").on("click", function() {
            var sVal = $("#searchInput").val().trim();
            sVal = decodeURIComponent(sVal);
            location.href = "./search.html?s=" + sVal;
        });
        $("#swiper-container").on("touchstart", ".swiper-slide img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiper-container").on("touchend", ".swiper-slide img", function (e) {
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
        $(window).on("scroll", function() {
            // var me = $(this);
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                addLoading();
                addListener();
            }
        });
    }

});
