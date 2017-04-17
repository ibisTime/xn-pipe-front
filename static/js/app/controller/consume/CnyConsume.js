define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
    var rate;
    var code = base.getUrlParam("c");
    var choseIdx = 0, totalAmount = 0;
    var cny2jf_rate = 1, rmbRemain = 0, jfRemain = 0;

    initView();

    function initView() {
        addListeners();
        loading.createLoading();
        $.when(
            getAccount(),
            getTransRate()
        ).then(loading.hideLoading, loading.hideLoading);
    }
    // 获取账户信息
    function getAccount(){
        return Ajax.get("802503", {
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                data.forEach(function(d, i){
                    if(d.currency == "JF"){
                        jfRemain = +d.amount
                        $("#jfRemain").html(base.formatJF(d.amount));
                    }
                })
            }
        });
    }
    // 获取转化汇率
    function getTransRate(){
        return Ajax.get("808917", {
            "key": "STORE_RMB2JF",
            "companyCode": COMPANY_CODE
        }).then(function(res){
        	rate = res.data.cvalue;
        });
    }
    function addListeners() {
        $("#content").on("click", ".pay-item", function() {
            var _self = $(this),
                idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            choseIdx = idx;
        });
        $("#rmbAmount").on("keyup", function(){
            var self = $(this),
                value = self.val();
                
            if($.isNumeric(value)){
                
                var needJF = (+value) * rate;
                totalAmount = value;
                
                $("#jfAmount").val(needJF);
                $("#totalAmount").html(needJF);
//              if(jfRemain < needJF){
//                  var a1 = (needJF - jfRemain);
//                  var a2 = (a1 / cny2jf_rate);
//                  totalAmount = a2 + needAmount;
//                  $("#totalAmount").html(base.formatMoney(a2 + needAmount));
//              }else{
//                  totalAmount = needAmount;
//                  $("#totalAmount").html(base.formatMoney(needAmount));
//              }
            }else{
                totalAmount = 0;
                $("#jfAmount").val(0);
                $("#needAmount").val(0);
                $("#totalAmount").html(0);
            }
        });
        $("#sbtn").click(function(){
//          if(choseIdx == 0){  //  余额支付
                pay(40);
//          }else { //微信支付
//              pay(2);
//          }
        });
    }

    function pay(payType){
        loading.createLoading("支付中...");
        Ajax.post("808244", {
            json: {
                storeCode: code,
                userId: base.getUserId(),
                amount: totalAmount*1000,
                payType: payType
            }
        }).then(function(res){
            // console.log(res);
            // res.msg && base.showMsg(res.msg);

            if(res.success){
                base.showMsg("支付成功");
                loading.hideLoading();
                setTimeout(function(){
                    base.goBack();
                }, 1000);
            }else{
                loading.hideLoading();
                
                base.showMsg(res.msg);
            }
        })
    }
    var wxConfig = {};

    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wxConfig.appId, //公众号名称，由商户传入
                "timeStamp": wxConfig.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": wxConfig.nonceStr, //随机串
                "package": wxConfig.wechatPackage,
                "signType": wxConfig.signType, //微信签名方式：
                "paySign": wxConfig.paySign //微信签名
            },
            function(res) {
                loading.hideLoading();
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    base.showMsg("支付成功");
                    setTimeout(function() {
                        location.href = "../user/user_info.html";
                    }, 1000);
                } else {
                    base.showMsg("支付失败");
                }
            }
        );
    }
    function wxPay(data){
        wxConfig = data;
        if (data && data.signType) {
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
            loading.hideLoading();
            base.showMsg(data.msg);
        }
    }
});
