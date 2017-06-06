define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'swiper',
], function(base, Ajax, dialog, Swiper) {
    $(function() {
        var mySwiper, rspData, user = 1, code = base.getUrlParam("code") || "";
        var userId =  base.getUserId();
        param = {
            "code":code
        }
        Ajax.post("808026", {
              json:param
            })
            .then(function(res) {
                if (res.success) {

                    var data = res.data,
                        imgs_html = "";
                        rspData = data;
                        $("#buyBtn").click(function() {
                            if (!$(this).hasClass("no-buy-btn")) {
                                var choseCode = code;
                                location.href = "./submit_order.html?code=" + choseCode + "&q=" + $("#buyCount").val();
                            }
                        });
                        $("#addCartBtn").click(function() {
                            if (!$(this).hasClass("no-buy-btn")) {
                                a2cart();
                            }
                        });
                        addListeners();
                        choseImg();
                        $("#cont").remove();

                } else {
                    doError("暂无数据");
                }
            });
        if (user !== "1") {
            base.getUser()
                .then(function(response) {
                    if (response.success) {
                        user = response.data;
                    }
                });
        } else {
            user = true;
        }

        function doError(msg) {
            var d = dialog({
                content: msg,
                quickClose: true
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, 2000);
        }

        function addListeners() {
            $("#subCount").on("click", function() {
                var orig = $("#buyCount").val();
                var JF,RMB;
                if (orig == undefined || orig == "" || orig == "0" || orig == "1") {
                    orig = 2;
                }
                orig = +orig - 1;
                JF =  rspData.price3 ? (rspData.price3/1000)*orig +"积分" : "";
                RMB =  msl.price1 ? '/'+(msl.price1/1000)*buyCount +"元" : "";
                $("#buyCount").val(orig);
                $("#buyCount").change();
                $(".JF").text(JF+RMB);
            });
            $("#addCount").on("click", function() {
                var orig = $("#buyCount").val();
                var JF,RMB;
                if (orig == undefined || orig == "") {
                    orig = 0;
                }
                orig = +orig + 1;
                JF =  rspData.price3 ? (rspData.price3/1000)*orig +"积分" : "";
                RMB =  msl.price1 ? '/'+(msl.price1/1000)*buyCount +"元" : "";
                $("#buyCount").val(orig);
                $("#buyCount").change();
                $(".JF").text(JF+RMB);

            });
            $("#buyCount").on("keyup", function(e) {
                var keyCode = e.charCode || e.keyCode;
                var me = $(this);
                if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                    me.val(me.val().replace(/[^\d]/g, ""));
                }
                if (!me.val()) {
                    me.change();
                }
            }).on("change", function(e) {
                var keyCode = e.charCode || e.keyCode;
                var me = $(this);
                if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                    me.val(me.val().replace(/[^\d]/g, ""))
                }
                if (!me.val()) {
                    me.val("1");
                }
                if (me.val() == "0") {
                    me.val("1");
                }
            });
        }


        //轮播图，获取需要的图片
        function choseImg() {
            var msl = rspData,
                pics = msl.pic;

            pics = pics.split("||");
                table_html = "<tbody>";
            if (!mySwiper) {
                $.each(pics,function (i,val) {
                    var html = '<div class="swiper-slide tc"><img src="'+PIC_PREFIX+val+'"></div>';
                    $("#btlImgs").append(html);
                })
                mySwiper = new Swiper('.swiper-container', {
                    'direction': 'horizontal',
                    'pagination': '.swiper-pagination'
                });
            }
            $("#btr-name").text(msl.name);
            var price3 = msl.price3 ? msl.price3/1000+"积分":"";
            var price1 = msl.price1 ?'/'+ msl.price1/1000+"元":"";
            $("#cnyPrice").text(price3+price1);
            $("#btr-description").append(msl.description);
            var buyCount = $("#buyCount").val();
            var JF =  msl.price3 ? (msl.price3/1000)*buyCount +"积分" : "";
            var RMB =  msl.price1 ? '/'+(msl.price1/1000)*buyCount +"元" : "";
            $(".JF").text(JF+RMB)
        }

        function isNumber(code) {
            if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
                return true;
            }
            return false;
        }

        function isSpecialCode(code) {
            if (code == 37 || code == 39 || code == 8 || code == 46) {
                return true;
            }
            return false;
        }

//      function add2Cart() {
//          if (user == "1") {
//              a2cart();
//          } else {
//              location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
//          }
//      }

        function a2cart() {
            var choseCode = code,
                param1 = {
                    "userId": userId,
                    "productCode": choseCode || "",
                    "quantity": $("#buyCount").val()
                },
                url = "808040";
            Ajax.post(url, {json:param1})
                .then(function(response) {
                    var msg;
                    if (response.success) {
                        msg = "添加购物车成功!";
                        location.href = "../mall/cart.html";
                    } else {
                        msg = "添加购物车失败!";
                    }
                    var d = dialog({
                        content: msg,
                        quickClose: true
                    });
                    d.show();
                    setTimeout(function() {
                        d.close().remove();
                    }, 2000);
                });
        }
    });
});
