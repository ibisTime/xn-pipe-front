define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
    init();

    function init() {
        addListeners();
    }

    function addListeners() {
        $("#kfzx").on("click", function(){
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#logout").on("click", function(){
            base.logout();
            location.href = "../user/login.html";
        });
    }
});