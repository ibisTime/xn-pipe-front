define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, Handlebars, loading, citySelect, scroll) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    var config = {
        start: 1,
        limit: 10,
        status: "1"
    }, citylist;

    init();

    function init() {
        Foot.addFoot(1);
        initIScroll();
        base.initLocation(initConfig, getInitData);
        addListener();
    }
    function initConfig(result) {
        citylist = result;
        citySelect.addCont({
            cityList: citylist,
            success: function (city) {
                $("#headDW").text(city);
            }
        });
        getInitData();
    }
    function getInitData() {
        loading.createLoading();

        loading.hideLoading();
    }
    function initIScroll(){
        scroll.init();
    }

    
    function addListener() {
    }
});