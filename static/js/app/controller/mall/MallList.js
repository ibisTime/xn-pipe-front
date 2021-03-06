define([
    'app/controller/base',
    'app/util/ajax',
    'IScroll',
    'app/module/loadImg/loadImg',
    'app/module/foot/foot',
], function(base, Ajax, IScroll, loadImg, Foot) {
    $(function() {
        var cate = base.getUrlParam("c") || "",
            imgWidth = (($(window).width() - 20) / 3 - 20) + "px",
            myScroll;
        var start1 = 1,limit1 =5;
        var isEnd = false,
            canScrolling = false;
        init();
    	Foot.addFoot(false);

        function init() {
            var html = '',
                html1 = "";
            param = {
                "parentCode": "0",
                "status": "1",
                "start": "1",
                "limit": "10",
                "type":"1",
                "companyCode": COMPANY_CODE,
            } ;
            addListeners();
            Ajax.post("808005", { json:param })
                .then(function(res) {
                    if (res.success) {
                        var cateData = res.data.list;
                        for (var i = 0; i < cateData.length; i++) {
                            var d = cateData[i];
                            html += '<li l_type="' + d.code + '">' + d.name + '</li>';
                            html1 += '<li l_type="' + d.code + '" class="wp33 tl fl">' + d.name + '</li>';
                        }
                        var scroller = $("#scroller");
                        scroller.find("ul").html(html);
                        $("#allItem").find("ul").html(html1);
                        addCategory();
                        cate == cate || cateData[0].code;
                        scroller.find("ul>li[l_type='" + cate + "']").click();
                    }
                });
        }

        function addCategory() {
            var scroller = $("#scroller");
            var lis = scroller.find("ul li");
            for (var i = 0, width = 0; i < lis.length; i++) {
                width += $(lis[i]).width() + 29;
            }
            $("#scroller").css("width", width);
            myScroll = new IScroll('#mallWrapper', { scrollX: true, scrollY: false, mouseWheel: true, click: true });
        }

        function addListeners() {
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
            });
            $("#mall-mask").on("click", function() {
                $("#down").click();
            });
            $("#allItem").on("click", "li", function() {
                var lType = $(this).attr("l_type");
                $("#scroller").find("li[l_type='" + lType + "']").click();
                $("#down").click();
            });
            $("#scroller").on("click", "li", function() {
                var me = $(this);
                $("#mallWrapper").find(".current").removeClass("current");
                me.addClass("current");
                myScroll.scrollToElement(this);
                lType = me.attr("l_type");
                start1 = 1;
                getProduces(lType);
                var allItem = $("#allItem");
                allItem.find("li.current").removeClass("current");
                allItem.find("li[l_type='" + lType + "']").addClass("current");
            });
            /**大类end */
        }

        function getProduces(category) {
            $("#mlTable ul").empty();
            var url ="808005";
            param1 = {
                "parentCode": category,
                "status": "1",
                "start": "0",
                "limit": "100",
                "companyCode": COMPANY_CODE,

            }
            Ajax.post(url, { json:param1 })
                .then(function(res) {
                    if (res.success) {
                        var lists = res.data.list;

                      $.each(lists,function (i,val) {
                          var name = val.name;
                          var l_code =val.code;
                          var html1= "<li l_code="+l_code+" class='wp20 tc s_10'>"+name+"</li>";
                          html1 = $(html1);

                          html1.on("click",function () {
                              start1 = 1;
                              displayDetail(l_code,category)
                              $(this).addClass("active").siblings().removeClass("active");
                          });





                          //清空小类后再添加，否则会直接添加进去，原来的依旧在
                          $("#mlTable ul").append(html1);

                      });

                        //默认选中第一个
                        var l_code = $("#mlTable ul li:eq(0)").attr("l_code");
                        if(typeof (+l_code)== "number"){
                            $("#mlTable ul li:eq(0)").addClass("active").siblings().removeClass("active");
                            displayDetail(l_code,category)
                        }
                        $("#cont").hide();


                        //下拉加载
                        $(window).on("scroll", function() {
                            // var me = $(this);
                            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())
                            //列表下拉框未显示时才加载

                            ) {
                                canScrolling = false;
                                addLoading();
                                displayDetail(l_code,category)
                            }
                        });



                    } else {
                        doError();
                    }
                });
        }
            function displayDetail(l_code,category) {
                $("#contUl").empty();
                param1 = {
                    "category": category,
                    "status": "3",
                    "type":l_code ,
                    "companyCode": COMPANY_CODE,
                    "start": start1,
                    "limit": limit1,
                }
                Ajax.post("808025", {json:param1})
                    .then(function (res) {
                        if(res.success){
                            var lists = res.data.list;
                            var totalCount = +res.data.totalCount;
                            if (totalCount <= limit1 || lists.length < limit1) {
                                isEnd = true;
                            }
                            $.each(lists,function (i,val) {
                                var pic2 = val.advPic,
                                    name = val.name,
                                    slogan = val.slogan,
                                    originalPrice = val.originalPrice ? val.originalPrice / 1000 : "",
                                    price2 = val.price2 ? val.price2 / 1000 + "菜狗币" : "",
                                    price3 = val.price3 ? val.price3 / 1000 + "积分" : "",
                                    price1 = val.price1 ? '/' + val.price1 / 1000 + "元" : "",
                                    code = val.code;

                                var html2 = '<li class="ptb8 clearfix b_bd_b plr10"><a class="show p_r min-h100p" href="../mall/buy.html?code=' + code + '"><div class="order-img-wrap tc"><img class="center-img1" src="' + PIC_PREFIX + pic2 + '"></div><div class="order-right-wrap clearfix"><p class="t_323232 s_12 line-tow">' + name + '</p><p class="t_999 s_10 line-tow">' + slogan + '</p><p class="t_red"><span class="s_10 t_40pe pl4">' + price2 + '</span><span class="s_10 t_40pe pl4">' + price3 + price1 +'</span></p><p class="s_10 t_through">市场参考价：<span>' + originalPrice + '</span>元</p></div></a></li>';

                                removeLoading();
                                $("#contUl").append(loadImg.loadImg(html2));
                            })
                            start1++;
                            }
                        //   为true才能下拉加载
                        canScrolling = true;
                    })
            }
        function doError() {
            $("#cont").hide();
            $("#mlTable").html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂无商品</div>');
        }

        function addLoading() {
            $("#contUl").append('<p class="scroll-loadding"></p>');
        }

        function removeLoading() {
            $("#contUl").find(".scroll-loadding").remove();
        }
    });
});
