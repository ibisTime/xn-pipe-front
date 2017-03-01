define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/foot/foot'
], function(base, Ajax, Handlebars, loading, Foot) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';

    init();

    function init() {
        Foot.addFoot(2);
        addListener();
    }

    function getInitData() {
        loading.createLoading();

        loading.hideLoading();
    }

    
    function addListener() {
        $("#content").on("click", ".job-item", function () {
            var _self = $(this);
            _self[_self.hasClass("active") ? "removeClass" : "addClass"]("active");
        });
        $("#find").on("click", function () {
            $(this).fadeOut(200);
            $("#waitIcon, #stopIcon").addClass("active");
            setTimeout(function () {
                $("#list1").fadeOut(200);
                $("#list2").fadeIn(200);
            }, 3000);
        });
        $("#stopIcon").on("click", function () {
            $("#waitIcon, #stopIcon").removeClass("active");
            $("#find").fadeIn(200);
        });
        $("#cancelBtn").on("click", function () {
            $("#waitIcon, #stopIcon").removeClass("active");
            $("#find").show();
            $("#list2").fadeOut(200);
            $("#list1").fadeIn(200);
        });
    }
});