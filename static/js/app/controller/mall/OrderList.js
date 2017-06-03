define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'app/module/loadImg/loadImg'
], function(base, Ajax, Dict, loadImg) {
    $(function() {
        var config = {
                status: "",
                limit: 15,
                start: 1,
                orderDir: "desc",
                orderColumn: "apply_datetime",
                applyUser: base.getUserId()
            },
            orderStatus = Dict.get("orderStatus"),
            imgWidth = (($(window).width() - 20) / 3) + "px",
            first, isEnd, index = base.getUrlParam("index") || 0,
            canScrolling;

        initView();

        function initView() {
            addListener();
            $("#status_ul>li:eq(" + index + ")").click();
        }

        function addListener() {
            $("#status_ul").on("click", "li", function(e) {
                config.start = 1;
                $("#status_ul").find("li.active").removeClass("active");
                var status = $(this).addClass("active").attr("status");
                status = status == "0" ? "" : status;
                config.status = status;
                first = true;
                isEnd = false;
                canScrolling = false;
                $("#ol-ul").empty();
                $("#noItem").addClass("hidden");
                addLoading();
                getOrderList();
                e.stopPropagation();
            });
            $(window).on("scroll", function() {
                var me = $(this);
                if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                    canScrolling = false;
                    addLoading();
                    getOrderList();
                }
            });
            $("#ol-ul").on("click", "li span.ol-tobuy", function(e) {
                e.stopPropagation();
                e.preventDefault();
                var me = $(this);
                location.href = "../mall/pay_order.html?code=" + me.closest("li[code]").attr("code");
            });
        }

        function getOrderList() {
            Ajax.post("808068", {json: config})
                .then(function(response) {
                    if (response.success) {
                        var data = response.data,
                            html = "",
                            totalCount = +data.totalCount,
                            curList = data.list;
                        if (totalCount <= config.limit || curList.length < config.limit) {
                            isEnd = true;
                        }
                        if (curList.length) {
                            curList.forEach(function(cl) {
                                var invoices = cl.productOrderList,
                                    totalAmount = cl.amount2,
                                    totalJFAmount = cl.amount3,
                                    totalRMBAmount = cl.amount1,
                                    code = cl.code;
                                html += '<li class="clearfix b_bd_b b_bd_t bg_fff mt10" code="' + code + '">' +
                                    '<a class="show plr10" href="./order_detail.html?code=' + code + '" class="show">' +
                                    '<div class="wp100 b_bd_b clearfix ptb10">' +
                                    '<div class="fl">订单号：<span>' + code + '</span></div>' +
                                    '</div>';
                                if (invoices.length == 1) {
                                    invoice = invoices[0];
                                    html += '<div class="wp100 clearfix ptb4 p_r min-h100p">' +
                                        '<div class="order-img-wrap tc default-bg top4"><img class="center-img1" src="' + base.getImg(invoice.product.advPic) + '"></div>' +
                                        '<div class="order-right-wrap clearfix"><div class="fl wp60 pt12">' +
                                        '<p class="tl line-tow">' + invoice.product.name + '</p>' +
                                        '</div>' +
                                        '<div class="fl wp40 tr pt12">';
                                    if (invoice.price3) {
                                        html += '<p class="item_totalP">' + base.formatMoney(invoice.price3) + '<span class="t_40pe s_09 pl4">积分</span>';
                                    }
                                    if (invoice.price1) {
                                        html += '/' + base.formatMoney(invoice.price1) + '<span class="t_40pe s_09 pl4">元</span>';
                                    }
                                    html += '</p><p class="t_80">×<span>' + invoice.quantity + '</span></p>' +
                                        '<p>&nbsp;</p>' +
                                        '<p class="ol_total_p right0">总计:<span class="pl4">' + base.formatMoney(cl.amount3) + "积分" + "/" + base.formatMoney(cl.amount1) + "元" +'</span></p>' +
                                        '</div></div>';
                                } else {
                                    html += '<div class="wp100 clearfix ptb4 p_r">';
                                    var arr = invoices.splice(0, 3);
                                    arr.forEach(function(invoice) {
                                        html += '<div class="fl wp33 tc plr2 ptb2" style="height: ' + imgWidth + '">' +
                                            '<div class="default-bg hp100 wp100 p_r over-hide"><img class="center-img1" src="' + base.getImg(invoice.product.advPic) + '"/></div></div>';
                                    });
                                }
                                html += '</div>' +
                                    '<div class="wp100 clearfix ptb6 ' + (invoices.length == 1 ? "mt1em" : "") + '">' +
                                    '<span class="fr inline_block bg_f64444 t_white s_10 plr8 ptb4 b_radius4 ' + (cl.status == "1" ? "ol-tobuy" : "") + '">' + getStatus(cl.status) + '</span>' +
                                    '</div>' +
                                    '</a></li>';
                            });
                            removeLoading();
                            $("#ol-ul").append(loadImg.loadImg(html));
                            config.start += 1;
                            canScrolling = true;
                        } else {
                            if (first) {
                                doError();
                            } else {
                                removeLoading();
                            }
                        }
                    } else {
                        if (first) {
                            doError();
                        } else {
                            removeLoading();
                        }
                    }
                    first = false;
                });
        }

        function addLoading() {
            $("#ol-ul").append('<li class="scroll-loadding"></li>');
        }

        function removeLoading() {
            $("#ol-ul").find(".scroll-loadding").remove();
        }

        function doError() {
            $("#ol-ul").empty();
            $("#noItem").removeClass("hidden");
            canScrolling = false;
        }

        function getStatus(status) {
            return orderStatus[status] || "未知状态";
        }
    });
});
