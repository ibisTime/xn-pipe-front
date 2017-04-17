define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	var code = base.getUrlParam("code");
	
	
    init();

    function init() {
        loading.createLoading();
		addListener();
		
    }

    function addListener() {
    	$.when(
    		Ajax.get("619072",{
	    		"code":code
	    	}),
	    	base.getDictList("demand_order_status")
    	).then(function(res1,res2){
    		if(res1.success&&res2.success){
    			var ocode = res1.data.code;//订单编号
				var oData = base.formatDate(res1.data.receiveDatetime,"yyyy-MM-dd");//下单时间
				var oStutas = dictArray(res1.data.status,res2.data)
				var oRemark = res1.data.remark;//备注
				var dPic = res1.data.demand.pic;//需求图片
				var dName = res1.data.dealer.name;//经销商
				var dSummary = res1.data.demand.summary;//需求简述
    			var dNote = res1.data.demand.detail;//需求详述
    			var ddealerCode = res1.data.dealerCode;//经销商code
				
				
				var dAddress = res1.data.demand.address;//地址
				
				
				var dData = base.formatDate(res1.data.demand.startDatetime,"yyyy-MM-dd");//开始时间
				var dPrice = res1.data.demand.price;//需求价钱
				
				
				$(".order-code").html("订单号："+ocode);
				$(".order-uDate").html("下单时间："+oData);
				$(".order-stutas").html("订单状态："+oStutas);
				$(".order-remark").html("备注："+oRemark);
				$(".demandPic").attr("src",PIC_PREFIX+dPic+THUMBNAIL_SUFFIN);
				$(".demandName").html(dName);
				$(".demandName").attr("data-code",ddealerCode);
				$(".demandSummary").html(dSummary);
				$(".demandAddress").html("地点："+dAddress);
				$(".demandData").html("时间："+dData);
				$(".demandPrice").html("￥"+dPrice);
				$(".demandNote").html(dNote);
				$(".dorder-con").attr("href","demand-detail-dealer.html?code="+ddealerCode)
	    		
	    		loading.hideLoading();
    		}else{
    			base.showMsg(res1.msg)
    		}
    	})
    }
    
    function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}

});