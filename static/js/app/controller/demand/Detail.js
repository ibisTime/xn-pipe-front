define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
], function(base, Ajax, Handlebars, loading) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';

    init();

    function init() {

        addListener();
    }

    function getInitData() {
        loading.createLoading();

        loading.hideLoading();
    }

    
    function addListener() {
    }
});