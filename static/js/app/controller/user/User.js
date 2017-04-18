define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/module/loading/loading',
    'app/module/bindMobile/bindMobile',
    'app/module/changeMobile/changeMobile',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, loading, BindMobile, ChangeMobile, scroll) {

    var myScroll,
        mobile;
    var userId = base.getUserId();

    init();

    function init() {
        Foot.addFoot(3);
        initIScroll();
        getTel();
        addListener();
        loading.createLoading();
        if (!base.isLogin()) {
            base.goLogin();
            return;
        }
        $.when(getUser()).then(function(res) {
            loading.hideLoading();
        }, function() {
            loading.hideLoading();
        })
    }

    function getJFAmount() {
        Ajax.get("802503", {"userId": userId}).then(function(res) {
            loading.hideLoading();
            if (res.success) {
                var amount = "0";
                $.each(res.data, function(i, d) {
                    if (d.currency == "JF") {
                        amount = base.formatMoney(d.amount);
                        $("#balance").html(amount + "积分");
                    }
                });
            } else {
                base.showMsg(res.msg);
            }
        }, function() {
            base.showMsg("账户信息获取失败");
            loading.hideLoading();
        });
    }

    function getTel() {
        return base.getSysConfig("telephone").then(function(res) {
            if (res.success) {
                var tel = res.data.note;
                //              	var tel = "400-832-0989";
                $("#telephone").html('<a class="show wp100" href="tel://' + tel + '">' + '<div class="default-icon-wrap fwrx-icon"></div>' + '服务热线：<span>' + tel + '</span>' + '<div class="st-jt"></div></a>');
            }
        })
    }

    function initIScroll() {
        myScroll = scroll.getInstance().getOnlyUpScroll({
            refresh: function() {
                $.when(getUser(true), getJFAmount()).then(function() {
                    setTimeout(function() {
                        myScroll.refresh();
                    }, 1000)
                });
            }
        });
    }

    function addListener() {

        ChangeMobile.addMobileCont({
            success: function(res) {
                mobile = res;
                $("#mobile").html(mobile);
            },
            error: function(msg) {
                base.showMsg(msg);
            }
        });

        BindMobile.addMobileCont({
            success: function(res) {
                mobile = res;
                // base.goBackUrl("../user/user.html", true);
            },
            hideFn: function() {
                // base.goBackUrl("../user/user.html", true);
            },
            error: function(msg) {
                base.showMsg(msg);
            }
        });

        $(".user-order").on("click", function() {
            location.href = "../mall/order_list.html?index=0";
        });

        $("#mobile").on("click", function() {
            if (mobile) {
                ChangeMobile.showMobileCont();
            } else {
                BindMobile.showMobileCont()
            }
        });
    }

    function getUser(refresh) {
        return base.getUser(refresh).then(function(res) {
            if (res.success) {
                $("#nickname").html(res.data.nickname);
                $("#avatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
                if (res.data.mobile == "" || res.data.mobile == null) {
                    $("#mobile").html("未绑定手机号");
                } else {
                    mobile = res.data.mobile;
                    $("#mobile").html(mobile);
                }
                getJFAmount();
                myScroll.refresh();
            } else {
                base.showMsg(res.msg);
            }
        }, function() {
            base.showMsg("加载失败");
            myScroll.refresh();
        });
    }
});
