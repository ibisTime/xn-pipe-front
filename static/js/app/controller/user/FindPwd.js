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
                repassword: {
                    required: true,
                    equalTo: "#password"
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
            bizType: "805048"
        });
        $("#registerBtn").on("click", function(e) {
            if ($("#registForm").valid()) {
                // $("#registerBtn").attr("disabled", "disabled").val("注册中...");
                loading.createLoading("找回中...");
                findPwd();
            }
        });
    }

    function findPwd() {
        var param = {
            "mobile": $("#mobile").val(),
            "newLoginPwd": $("#password").val(),
            "smsCaptcha": $("#verification").val(),
            "kind": "f1",
            "loginPwdStrength": base.calculateSecurityLevel($("#password").val())
        };
        Ajax.post("805048", { json: param })
            .then(function(response) {
                if (response.success) {
                    base.showMsg("密码找回成功");
                    setTimeout(function() {
                        base.goLogin();
                    }, 1000);
                } else {
                    base.showMsg(response.msg);
                }
                loading.hideLoading();
            }, function() {
                loading.hideLoading();
                base.showMsg("非常抱歉，密码找回失败");
                // $("#registerBtn").removeAttr("disabled").val("注册");
            });
    }
});