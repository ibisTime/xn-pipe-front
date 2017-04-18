define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading'
], function(base, Ajax, Handlebars, loading) {

    var code = base.getUrlParam("code"),mobile;

	$.when(
		Ajax.get("619917",{
		"ckey": "limit"
		},false),
		init()
	).then(function(res){
		limit=res.data.cvalue;
	})

    function init() {
    	loading.createLoading();
        getDetail();
        addListener();
    }

    function addListener() {

    	$("#demandBtn").on("click",function(){
    		var n;

    		base.getUserInfo1(limit,function(){
				var param = {
	    			"code": code,
					"userId": base.getUserId()
	    		}
	    		Ajax.post("619028",{json:param})
	    			.then(function(res){
	    				if(res.success){
	    					base.showMsg("接活成功");
	    					setTimeout(function(){
	    						location.href = "../user/demand-order-list.html"
	    					},800)
	    				}else{
	    					base.showMsg(res.msg);
	    				}
	    			},function(){
	    				base.showMsg("接活失败，请重新接活")
	    			})
			},function(){

			})

    	})
    }

    function getDetail(){
    	Ajax.get("619032",{
    		"code":code
    	}).then(function(res){
    		if(res.success){
    			var dPic = res.data.pic;//需求图片
    			var dName = res.data.dealer.name;//经销商
    			var dSummary = res.data.summary;//需求简述
    			var dAddress = res.data.address;////地址
                var startData = base.formatDate(res.data.startDatetime,"yyyy-MM-dd");//开始时间
    			var endData = base.formatDate(res.data.endDatetime,"yyyy-MM-dd");//结束时间
    			var dPrice = res.data.price;//需求价钱
    			var dNote = res.data.detail;//需求详述

    			$(".demandPic").attr("src",PIC_PREFIX+dPic+THUMBNAIL_SUFFIX);
    			$(".demandName").html(dName);
    			$(".demandSummary").html(dSummary);
    			$(".demandAddress").html("地点："+dAddress);
                $(".demandStartData").html("开始时间："+startData);
    			$(".demandEndData").html("结束时间："+endData);
    			$(".demandPrice").html(dPrice);
    			$(".demandNote").html(dNote);

    			if(res.data.status==1){
    				$("#demandBtn").show()
    			}
    			loading.hideLoading();
    		}
    	},function(){
    		loading.hideLoading();
    		base.showMsg("加载失败，请刷新")
    	})
    }
});
