define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll',
    'IScroll'
], function(base, Ajax, Foot, Handlebars, loading, citySelect, scroll, IScroll) {

    var myScroll,
        myScroll1,
        isEnd = false,
        isLoading = false,
        config = {},
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';

    var hallListTmpl = __inline("../../ui/hall-list.handlebars");

    var limit;
    var navIndex = 0;
    var userId = base.getUserId();
    var lType;
    init();
    function init() {
        Foot.addFoot(1);
        initIScroll();
        base.initLocation(initConfig, getInitData);
        addListener();
    }
    function initConfig() {
        var cLongitude = sessionStorage.getItem("dw-latitude");
        var cLatitude = sessionStorage.getItem("dw-latitude");
        config = {
            longitude: cLongitude,
            latitude: cLatitude,
            start: 1,
            limit: 10,
            type: ""
        }
        getInitData();
    }

    function getInitData() {
        loading.createLoading();
        Handlebars.registerHelper('formatDemandStatus', function(status, options){
            return status == "1" ? "确认接活" : "已完成";
        });
        $.when(
            getHallList(true),
            menuList()
        ).then(loading.hideLoading);
        getLimit();
    }

    function initIScroll() {
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function() {
                if (navIndex == 0) {
                    getHallList();
                } else {
                    getAgencyList()
                }
            },
            refresh: function() {
                if (navIndex == 0) {
                    getHallList(true);
                } else {
                    getAgencyList(true)
                }
            }
        });

    }

    // 获取接单上限
    function getLimit(){
        Ajax.get("619917", {
            "ckey": "limit"
        }).then(function(res) {
            limit = res.data.cvalue;
        })
    }
    // 获取附近需求
    function getHallList(refresh) {
        if (!isLoading && (!isEnd || refresh)) {
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619033", config, !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var list = res.data.list;
                        if (list.length < config.limit) {
                            isEnd = true;
                        }
                        var html = $(hallListTmpl({items: list}));
                        html.find("[data-status='6']").removeClass("demandBtn").addClass("disabled");
                        $("#needList")[refresh
                                ? "html"
                                : "append"](html);
                        config.start++;
                    } else {
                        if (refresh) {
                            $("#needList").html('<div class="item-error">暂无需求</div>');
                        }
                        isEnd = true;
                        res.msg && base.showMsg(res.msg);
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;
                }, function() {
                    isLoading = false;
                    isEnd = true;
                    if (refresh) {
                        $("#needList").html('<div class="item-error">暂无需求</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }
    // 获取附近经销商
    function getAgencyList(refresh) {
        if (!isLoading && (!isEnd || refresh)) {
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619014", config, !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var list = res.data.list;
                        if (list.length < config.limit) {
                            isEnd = true;
                        }
                        $("#needList")[refresh
                                ? "html"
                                : "append"](hallListTmpl({items: list}));
                        config.start++;
                    } else {
                        if (refresh) {
                            $("#needList").html('<div class="item-error">暂无经销商</div>');
                        }
                        isEnd = true;
                        res.msg && base.showMsg(res.msg);
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;
                }, function() {
                    isLoading = false;
                    isEnd = true;
                    if (refresh) {
                        $("#needList").html('<div class="item-error">暂无经销商</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }

    function menuList() {
        var param = {
            "parentKey": "demand_type",
            "type": "1",
            "dkey": ""
        }
        return Ajax.post("807706", {json: param}).then(function(res) {
            if (res.success) {
                var cateData = res.data;
                var scroller = $("#scroller");
                for (var i = 0; i < cateData.length; i++) {
                    var d = cateData[i],
                        html = "",
                        html1 = "";
                    html += '<li l_type="' + d.dkey + '">' + d.dvalue + '</li>';
                    html1 += '<li l_type="' + d.dkey + '" class="wp33 tl fl mtb10 fs08rem">' + d.dvalue + '</li>';
                    scroller.find("ul").append(html);
                    $("#allItem").find("ul").append(html1);
                }
                addMenu();
            }
        });
    }

    function addMenu() {
        var scroller = $("#scroller");
        var lis = scroller.find("ul li");
        for (var i = 0, width = 0; i < lis.length; i++) {
            width += $(lis[i]).width() + 29;
        }
        $("#scroller").css("width", width);
        myScroll1 = new IScroll('#mallWrapper', {
            scrollX: true,
            scrollY: false,
            mouseWheel: true,
            click: true
        });
    }

    function addListener() {

        $("#needList").on("click", ".demandBtn", function() {
            var thisCode = $(this).attr("data-code");
            var n;

            base.getUserInfo1(limit, function() {
                var param = {
                    "code": thisCode,
                    "userId": base.getUserId()
                }
                Ajax.post("619028", {json: param}).then(function(res) {
                    if (res.success) {
                        base.showMsg("接活成功");
                        setTimeout(function() {
                            location.href = "../user/demand-order-list.html"
                        }, 800)
                    } else {
                        base.showMsg(res.msg);
                    }
                }, function() {
                    base.showMsg("接活失败，请重新接活");
                })
            }, function() {})

        })

        $("#needList").on("click", ".demandBtn0", function() {
            var thishref = $(this).attr("href");
        });

        $(".orderNavBar").on('click', '.orderNav', function() {
            $(this).addClass("red order")
                .siblings(".orderNav").removeClass("red order");
            navIndex = $(this).index();
            if (navIndex == 0) {
                $("#wrapper").addClass('scroll-wrapper1');
                $("#needMenu").show();
                loading.createLoading();
                getHallList(true).then(loading.hideLoading);
            } else {
                $("#wrapper").removeClass('scroll-wrapper1');
                $("#needMenu").hide();
                loading.createLoading();
                getAgencyList(true).then(loading.hideLoading);
            }
        });

        /**大类start */
        $("#down").on("click", function() {
            var me = $(this);
            if (me.hasClass("down-arrow")) {
                $("#allCont").removeClass("hidden");
                me.removeClass("down-arrow").addClass("up-arrow");
            } else {
                $("#allCont").addClass("hidden");
                me.removeClass("up-arrow").addClass("down-arrow");
            }
        })
        $("#mall-mask").on("click", function() {
            $("#down").click();
        })
        $("#allItem").on("click", "li", function() {
            lType = $(this).attr("l_type");
            $("#scroller").find("li[l_type='" + lType + "']").click();
            $("#down").click();
        })
        $("#scroller").on("click", "li", function(e) {
            var me = $(this);
            $("#mallWrapper").find(".current").removeClass("current");
            me.addClass("current");
            myScroll1.scrollToElement(this);
            lType = me.attr("l_type");
            config.type = lType;
            start1 = 1;
            if (lType == "lType1") {
                config.type = "";
            }
            loading.createLoading();
            getHallList(config).then(loading.hideLoading);
            var allItem = $("#allItem");
            allItem.find("li.current").removeClass("current");
            me.find("li[l_type='" + lType + "']").addClass("current");
            e.stopPropagation();
        })
        /**大类end */
    }

});
