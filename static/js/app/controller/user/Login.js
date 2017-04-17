define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
    // 'app/module/foot/foot'
], function(base, Ajax, Validate, loading) {
    var returnUrl;

    init();

    function init() {
        // Foot.addFoot(3);
        addListeners();
        returnUrl = base.getReturnParam();
        if (returnUrl) {
            $("#toRegister").attr("href", './register.html?return=' + returnUrl);
            $("#fdPwd").attr("href", './findPwd.html?return=' + returnUrl);
        } else {
            $("#toRegister").attr("href", './register.html');
            $("#fdPwd").attr("href", './findPwd.html');
        }
    }

    function addListeners() {
        $("#loginForm").validate({
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
                }
            },
            onkeyup: false
        });

        $("#loginBtn").on('click', loginAction);
    }

    function loginAction() {
        if ($("#loginForm").valid()) {
            // $("#loginBtn").attr("disabled", "disabled").val("登录中...");
            loading.createLoading("登录中...");
            var param = {
                "loginName": $("#mobile").val(),
                "loginPwd": $("#password").val(),
                "kind": "f1"
            };

            Ajax.post("805043", { json: param })
                .then(function(res) {
                    loading.hideLoading();
                    if (res.success) {
                        base.setSessionUser(res);
                        base.goBackUrl("./user.html");
                    } else {
                        base.clearSessionUser();
                        // $("#loginBtn").removeAttr("disabled").val("登录");
                        base.showMsg(res.msg);
                    }
                }, function() {
                    loading.hideLoading();
                    base.clearSessionUser();
                    // $("#loginBtn").removeAttr("disabled").val("登录");
                    base.showMsg("登录失败");
                });
        }
    }
});