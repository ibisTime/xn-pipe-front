define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loadImg/loadImg',
    'app/module/loading/loading'
], function(base, Ajax, dialog, loadImg, loadIng) {
    var code = base.getUrlParam("code") || "";
    var choseIdx = 0;
    queryOrder();
    addListener();
    //查询订单信息
    function queryOrder() {
        var config = {
                "code": code
            };
        var modelCode = "",
            modelName, quantity, salePrice, receiveCode, productName, cnyPrice;
        Ajax.get("808066", config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        productOrderList = data.productOrderList;
                    //如果不是待支付订单，则直接跳到个人中心页面
                    if (data.status !== "1") {
                        location.href = "../user/user_info.html";
                    }
                    $("#cont").remove();
                    var cgbTotal = 0,
                        jfTotal = 0,
                        rmbTotal = 0;
                    //订单相关商品信息
                    if (productOrderList.length) {
                        var html = '';
                        //计算每种商品的总价
                        productOrderList.forEach(function(product) {
                            quantity = +product.quantity;
                            if(product.price2){
                                cgbTotal += quantity * (+product.price2);
                            }
                            if(product.price3){
                                jfTotal += quantity * (+product.price3);
                            }
                            if(product.price1){
                                rmbTotal += quantity * (+product.price1);
                            }
                            html += '<li class="ptb8 clearfix b_bd_b plr10" modelCode="' + product.productCode + '">' +
                                '<a class="show p_r min-h100p" href="../mall/buy.html?code=' + product.productCode + '">' +
                                '<div class="order-img-wrap tc default-bg"><img class="center-img1" src="' + base.getImg(product.product.advPic) + '"/></div>' +
                                '<div class="order-right-wrap clearfix"><div class="fl wp60">' +
                                '<p class="tl line-tow">' + product.product.name + '</p>' +
                                '</div>' +
                                '<div class="fl wp40 tr s_11">';
                            if(product.price2){
                                html += '<p class="item_totalP">' + base.formatMoney(product.price2) + '<span class="t_40pe s_09 pl4">菜狗币</span></p>';
                            }
                            if (product.price3) {
                                html += '<p class="item_totalP">' + base.formatMoney(product.price3) + '<span class="t_40pe s_09 pl4">积分</span>';
                            }
                            if (product.price1) {
                                html +=  "/"+ base.formatMoney(product.price1) + '<span class="t_40pe s_09 pl4">元</span>';
                            }
                            html += '</p><p class="t_80">×<span>' + product.quantity + '</span></p></div></div></a></li>'
                        });
                        html += '</ul>';
                        $("#cont").remove();
                        $("footer, #items-cont").removeClass("hidden");
                        $("#items-cont").append(loadImg.loadImg(html));

                        if(data.amount2){
                            $("#totalAmount").html(base.formatMoney(data.amount2)).parent().parent().removeClass('hidden');
                        }

                        if (data.amount3) {
                            $("#mAdd, #jfDiv").removeClass("hidden");
                            $("#totalJFAmount").html(base.formatMoney(data.amount3));
                        }
                        if (data.amount1) {
                            $("#mAdd,#rmbDiv").removeClass("hidden");
                            $("#totalRMBAmount").html(base.formatMoney(data.amount1));
                        }
                        //添加地址信息

                        var addrHtml = '<p><span class="pr2em">总计</span>：<span class="pl_5rem">' + base.formatMoney(data.amount3) + "积分" +"/"+base.formatMoney(data.amount1) + "元" + '<span></span></p>' +
                            '<p><span class="pr1em">订单号</span>：<span class="pl_5rem">' + data.code + '</span></p>';
                        if (data.reAddress) {
                            addrHtml += '<p><span>配送信息：</span><span class="pl_5rem">' + data.receiver + '</span><span class="pl10">' + data.reMobile + '</span></p>' +
                                '<p class="pl5_5rem t_73 s_09_5">' + data.reAddress + '</p>';
                        }
                        $("#addressDiv").html(addrHtml);
                    } else {
                        $("#cont").remove();
                        doError("#container");
                    }
                } else {
                    $("#cont").remove();
                    doError("#container");
                }
            });
    }

    function doError(cc) {
        $(cc).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
    }

    function showMsg(cont) {
        var d = dialog({
            content: cont,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, 2000);
    }
    function addListener() {
        /*********支付订单前的确认框start*********/
        //确定支付按钮
        $("#odOk").on("click", function(e) {
            $("#od-mask, #od-tipbox").addClass("hidden");

            if (choseIdx == 1) {
                // 微信支付
                wxPayOrder();
            } else if(choseIdx == 0){
                // 余额支付
                doPayOrder()
            }
            // doPayOrder();
        });
        $("#odCel").on("click", function(e) {
            $("#od-mask, #od-tipbox").addClass("hidden");
        });
        //取消支付按钮
        /*********支付订单前的确认框end*********/
        //点击支付按钮
        $("#sbtn").on("click", function(e) {
            e.stopPropagation();
            $("#od-mask, #od-tipbox").removeClass("hidden");
        });

        $("#content").on("click", ".pay-item", function() {
            var _self = $(this),
                idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            choseIdx = idx;
        });
    }

    // 余额支付
    function doPayOrder() {
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post('808052', {
            json:{
                codeList: [code],
                payType: "90"
            }
        }).then(function(response) {
            if (response.success) {
                setTimeout(function() {
                    location.href = "./order_list.html?index=0";
                }, 2000);
            } else {
                $("#loaddingIcon").addClass("hidden");
                base.showMsg(response.msg);
            }
        });
    }

 
    // 微信支付
    function wxPayOrder() {
        // loading.createLoading("支付中...");
        Ajax.post("808052", {
            json: {
                codeList: [code],
                payType: "5"
            }
        }).then(wxPay, function() {
            loading.hideLoading();
            base.showMsg("非常抱歉，支付请求提交失败");
        });
    }
    var response = {};

    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": response.data.appId, //公众号名称，由商户传入
                "timeStamp": response.data.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": response.data.nonceStr, //随机串
                "package": response.data.wechatPackage,
                "signType": response.data.signType, //微信签名方式：
                "paySign": response.data.paySign //微信签名
            },
            function(res) {
                // loading.hideLoading();
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    base.showMsg("支付成功");
                    setTimeout(function() {
                        location.href = "/";
                    }, 1000);
                } else {
                    base.showMsg("支付失败");
                }
            }
        );
    }

    function wxPay(response1) {
        response = response1;
        if (response.data && response.data.signType) {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.removeEventListener("WeixinJSBridgeReady", onBridgeReady);
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.detachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.detachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        } else {
            // loading.hideLoading();
            base.showMsg(response1.msg || "微信支付失败");
        }
    }
});
