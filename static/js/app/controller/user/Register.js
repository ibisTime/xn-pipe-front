define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/smsCaptcha/smsCaptcha',
    'app/module/loading/loading'
], function(base, Ajax, Validate, smsCaptcha, loading) {
    init();

    function init() {
        addListeners();
        $("#toLogin").attr("href", "./login.html?return=" + base.getReturnParam());
    }

    function addListeners() {
        $("#registForm").validate({
            'rules': {
                mobile: {
                    required: true,
                    mobile: true
                },
                password: {
                    required: true,
                    maxlength: 16,
                    minlength: 6,
                    isNotFace: true
                },
                verification: {
                    required: true,
                    sms: true
                }
            },
            onkeyup: false
        });
        smsCaptcha.init({
            checkInfo: function () {
                return $("#mobile").valid();
            },
            bizType: "805041"
        });
        $("input").on("focus",function () {
            $(this).siblings("label").hide();
        });
        $("input").on("blur",function () {
            if($(this).val()==""){
                $(this).siblings("label").show();
            }
        });
        $("#registerBtn").on("click", function(e) {
            register();
        });
    }

    function finalRegister() {
        var param = {
            "mobile": $("#mobile").val(),
            "loginPwd": $("#password").val(),
            "smsCaptcha": $("#verification").val(),
            "loginPwdStrength": base.calculateSecurityLevel($("#password").val()),
            "kind": "f1",
            "isRegHx": 0
        };
        Ajax.post("805041", { json: param })
            .then(function(response) {
                if (response.success) {
                    loginUser({
                    "loginName": param.mobile,
                    "loginPwd": param.loginPwd,
                    "kind": "f1"
                });
                } else {
                    loading.hideLoading();
                    base.showMsg(response.msg || "非常抱歉，注册失败");
                    // $("#registerBtn").removeAttr("disabled").val("注册");
                }
            }, function() {
                loading.hideLoading();
                base.showMsg("非常抱歉，注册失败");
                // $("#registerBtn").removeAttr("disabled").val("注册");
            });
    }
    function loginUser(param) {
        Ajax.post("805043", { json: param })
            .then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    base.setSessionUser(response);
                    base.goBackUrl("./user.html");
                } else {
                    base.showMsg("注册成功！");
                    base.clearSessionUser();
                    setTimeout(function() {
                        location.href = "./login.html?return=" + base.getReturnParam();
                    }, 1000);
                }
            }, function() {
                loading.hideLoading();
                base.showMsg("注册成功！");
                base.clearSessionUser();
                setTimeout(function() {
                    location.href = "./login.html?return=" + base.getReturnParam();
                }, 1000);
            });
    }

    function register() {
        if ($("#registForm").valid()) {
            // $("#registerBtn").attr("disabled", "disabled").val("注册中...");
            loading.createLoading("注册中...");
            finalRegister();
        }
    }
});