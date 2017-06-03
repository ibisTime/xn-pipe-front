define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {


    init();

    function init() {
        if (!base.isLogin())
            base.goLogin();
        else {
            base.initLocation(initData, initData);
        }
    }

    function initData() {
        getData();
        addListener();
    }

    function getData() {
        loading.createLoading();
        var userId = base.getUserId();
        var mydate = new Date();
        var nowDate = mydate.format("yyyy-MM-dd");
        $.when(
            Ajax.get("805102", {
                "userId": userId
            }),
            Ajax.get("805103", {
                "userId": userId,
                "dateStart": nowDate
            })
        ).then(function(res1, res2) {
            loading.hideLoading();
            if (res1.success) {
                for (i = 0; i < res1.data.length; i++) {
                    var tempDate = base.formatDate(res1.data[i].signDatetime, "yyyy-MM-dd")

                    if (nowDate == tempDate) {
                        $("#btn-signIn").val("明天再来").addClass("a-qiandao");
                    }
                }
            } else {
                base.showMsg(res1.msg);
            }

            if (res2.success) {
                $(".signInNum").html(res2.data);
            } else {
                base.showMsg(res2.msg);
            }
        });
    }

    function addListener() {
        $("#btn-signIn").click(function() {
            if (!base.isLogin()) {
                base.goLogin();
                return;
            }
            var addr = getAddr();
            loading.createLoading("签到中...");
            Ajax.post("805931", {
                json: {
                    "userId": base.getUserId(),
                    "location": addr || "中国"
                }
            }).then(function(res) {
                loading.hideLoading();
                if (res.success) {
                    var num = $(".signInNum").text();
                    num = +num + 1;
                    $(".signInNum").text(num);
                    $("#btn-signIn").val("明天再来").addClass("a-qiandao");
                } else {
                    base.showMsg(res.msg);
                }
            });
        });

        $("#backBtn").on("click",function(){
            location.href = "./user.html"
        })
    }

    function getAddr() {
        return sessionStorage.getItem("address") || "";
    }
});
