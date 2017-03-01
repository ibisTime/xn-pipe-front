define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, showImg, scroll) {

    init();

    function init() {
        loading.createLoading();

        loading.hideLoading();
        initIScroll();
        addListener();
    }

    function initIScroll(){
        scroll.init();
    }

    function addListener() {

    }
});