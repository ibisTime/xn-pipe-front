define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, scroll) {
	var myScroll, isEnd = false, isLoading = false;

	var dOrderStutas = 0;//0，进行中 ；1，已接单
	var userId = base.getUserId();
	var navIndex = 0;

	var config = {
			receiver: userId,
	        start: 1,
	        limit: 10,
	        status: 0
	    };


    init();

    function init() {
        loading.createLoading();
		getInitData()
        initIScroll();
        addListener();
    }

    function getInitData(){
    	getDOrderList(true);
        loading.hideLoading();
    }

    function addListener() {

        $(".orderNav").click(function(){
        	var thisINdex = $(this).index();
        	if(navIndex == thisINdex){
        		navIndex =navIndex;
        	}else{
        		navIndex= thisINdex;
        		$("#content").html("");
        	}

        	if(thisINdex==0){
        		config = {
					receiver: userId,
			        start: 1,
			        limit: 10,
			        status: 0
			    }
        	}else{
        		config = {
					receiver: userId,
			        start: 1,
			        limit: 10,
			        statusList: [91,92,2]
			    }
        	}

            $(this).addClass("red").addClass("order").siblings(".orderNav").removeClass("red").removeClass("order");
            getDOrderList(true);
        })

        //取消订单
        $("#content").on("click",".dOcancelBtn",function(){
        	var thisCode = $(this).attr("data-code");

        	cancelOrder("619060",thisCode,getDOrderList);
        });
    }

	function cancelOrder(bizType, code, success) {
		var dcode = code;
        base.confirm("确定取消订单吗？")
            .then(function() {
                loading.createLoading("提交申请中...");
                Ajax.post(bizType, {
                    json: {
                        "code": dcode,
                        "userId": userId
                    }
                }).then(function(res) {
                    if (res.success) {
                        base.showMsg("申请提交成功");
                        loading.createLoading();
                        success(true);
                    } else {
                        loading.hideLoading();
                        base.showMsg(res.msg || "申请失败");
                    }
                }, function() {
                    loading.hideLoading();
                    base.showMsg("申请失败");
                });
            }, base.emptyFun);
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyUpScroll({
        	loadMore: function () {
                getDOrderList();
        		loading.hideLoading();
            },
            refresh: function () {
                myScroll.refresh();
            }
        });

    }

    function getDOrderList(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619070", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        var hallListTmpl = "";

                        if(list.length < config.limit){
	                        isEnd = true;
	                    }
                        for(var i = 0; i < list.length; i++){

							var dPic = list[i].demand.pic;//需求图片
			    			var dName = list[i].dealer.name;//经销商
			    			var dSummary = list[i].demand.summary;//需求简述

			    			var dAddress = list[i].demand.address;//地址
                            var startDatetime = base.formatDate(list[i].demand.startDatetime,"yyyy-MM-dd");//开始时间
			    			var endDatetime = base.formatDate(list[i].demand.endDatetime,"yyyy-MM-dd");//开始时间
			    			var dPrice = list[i].demand.price;//需求价钱

			    			var s="";

			    			s+="<a href='demand-order-detail.html?code="+list[i].code+"' class='wp100 plr15 ba mt10 p-r hig140 bb'>";
	                    	s+="<div class='inline_block order-img ptb19'><img src='"+PIC_PREFIX+dPic+THUMBNAIL_SUFFIX+"' ></div>";
	                    	s+="<div class='inline_block  p-a order-box hp100  pt14 pr15'>";
	                        s+="<div class='fs14 '>"+dName+"</div>";
	                        s+="<div class='fs13 '>"+dSummary+"</div>";
	                        s+="<div class='fs12 t_norwrap'>地点："+dAddress+"</div>";
                            s+="<div class='fs12 '>开始时间："+startDatetime+"</div>";
	                        s+="<div class='fs12 '>结束时间："+endDatetime+"</div>";
	                        s+="<div class='fs14 red  order-price pt15'>￥"+dPrice+"</div></div></a>";
	                        if(navIndex == 0){
	                        	s+="<div class='wp100 lh50 hig50 ba plr15 p-r pt9 ' ><input type='button' value='取消' data-code='"+list[i].code+"' class='cancel tc red fs14 p-a dOcancelBtn'></div>";
	                        }else if(list[i].status ==91||list[i].status ==92){
	                        	s+="<div class='wp100 lh50 hig50 ba plr15 p-r pt9' ><input type='button' value='已取消' data-code='"+list[i].code+"' class='cancel tc red fs14 p-a'></div>";
	                        }else{
	                        	s+="<div class='wp100 lh50 hig50 ba plr15 p-r pt9' ><input type='button' value='已完成' data-code='"+list[i].code+"' class='cancel tc red fs14 p-a'></div>";
	                        }

			    			hallListTmpl +=s;

	                        $("#content")[refresh ? "html" : "append"](hallListTmpl);
                        }

                        config.start++;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无需求</div>');
                        }
                        isEnd = true;
                        res.msg && base.showMsg(res.msg);
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;

        			loading.hideLoading();
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无需求</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
        			loading.hideLoading();
                });
        }
    }

});
