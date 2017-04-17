define([
    'app/controller/base', 'app/util/ajax'
], function(base, Ajax) {
    var url = "808218",
        code = base.getUrlParam("c") || "",
        config = {
            code: code,
            userId: base.getUserId()
        },
        rate2;

    initView();

    function initView() {
        if (code) {
            business();
            addListeners();
        } else {
            $("#cont").remove();
            base.showMsg("未传入商家编号!");
        }
    }

    function addListeners() {
        //点赞
        $("#dzIcon").on("click", function() {
            var $img = $("#goodImg");
            $img.attr("src");
            if ($img.attr("src").indexOf("/good.png") != -1) {
                praise();
            } else {
                praise(true);
            }
        });
        //积分消费
        $("#sbtn").on("click", function() {
			location.href = "./cny_consume.html?c=" + code;
        });
    }
    //点赞
    function praise(flag) {
        var span = $("#totalDzNum"),
            img = $("#goodImg");
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post('808240', {
            json: {
                storeCode: code,
                type: 1,
                userId: base.getUserId()
            }
        }).then(function(response) {
            $("#loaddingIcon").addClass("hidden");
            if (response.success) {
                if (!flag) {
                    span.text(+ span.text() + 1);
                    img.attr("src", "/static/images/good1.png");
                } else {
                    span.text(+ span.text() - 1);
                    img.attr("src", "/static/images/good.png");
                }
            } else if (response.timeout) {
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
            } else {
                base.showMsg(response.msg);
            }
        });
    }
    //根据code搜索商家信息
    function business() {
        Ajax.get(url, config).then(function(response) {
            $("#cont").remove();
            if (response.success) {
                var data = response.data;
                if (data.isDZ) {
                    $("#goodImg").attr("src", "/static/images/good1.png");
                }
                $("#pic1").attr("src", base.getImg1(data.pic, 1));
                $("#name").text(data.name);
                $("#totalDzNum").text(data.totalDzNum);
                $("#advert").text(data.advert);
                $("#address").text(data.province + " " + data.city + " " + data.area + " " + data.address);
                $("#detailCont").append('<a class="fr clearfix" href="tel://' + data.bookMobile + '"><span class="pr6 va-m inline_block">' + data.bookMobile + '</span><img class="wp18p va-m" src="/static/images/phone.png"/></a>');
                $("#description").html(data.description);

                rate2 = data.rate2;
            } else {
                doError();
            }
        });
    }

    function doError() {
        $("#description").html('<div class="bg_fff tc wp100">暂时无法获取商家信息</div>');
    }
});
