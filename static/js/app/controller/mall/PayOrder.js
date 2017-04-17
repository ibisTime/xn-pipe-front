define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loadImg/loadImg'
], function(base, Ajax, dialog, loadImg) {
    var code = base.getUrlParam("code") || "";

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
                        jfTotal = 0;
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
                                html += '<p class="item_totalP">' + base.formatMoney(product.price3) + '<span class="t_40pe s_09 pl4">积分</span></p>';
                            }
                            html += '<p class="t_80">×<span>' + product.quantity + '</span></p></div></div></a></li>'
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
                        //添加地址信息

                        var addrHtml = '<p><span class="pr2em">总计</span>：<span class="pl_5rem">' + base.formatMoney(data.amount3) + "积分" + '<span></span></p>' +
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
            doPayOrder();
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
    }

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
});
