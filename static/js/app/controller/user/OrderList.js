define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, showImg, scroll) {
	var index = base.getUrlParam("index") || 0;
	
    init();

    function init() {
        loading.createLoading();

        loading.hideLoading();
        initIScroll();
        addListener();
        
       $(".dorderNav").eq(index).addClass("red").addClass("order").siblings(".dorderNav").removeClass("red").removeClass("order");
    }

    function addListener() {
        $(".dorderNav").click(function(){
            $(this).addClass("red").addClass("order").siblings(".dorderNav").removeClass("red").removeClass("order");
        })
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyUpScroll({
            refresh: function () {
                myScroll.refresh();
            }
        });

    }

});