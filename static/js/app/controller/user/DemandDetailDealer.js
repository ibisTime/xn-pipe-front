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
		Ajax.get("619012",{
    		"code":code
    	}).then(function(res){
    		if(res.success){
				var dPic = res.data.pic;//经销商图片
				var dName = res.data.name;//经销商
				var dContact = res.data.contact;//经销商联系方式
				var dName = res.data.name;//经销商
				var dOwner = res.data.owner;//负责人
				var dContact = res.data.contact;//联系方式
    			var dNote = res.data.detail;//经销商详述
				
				var dAddress = res.data.address;//地址				
				
				var dData = base.formatDate(res.data.startDatetime,"yyyy-MM-dd");//开始时间
				var dPrice = res.data.price;//需求价钱
				
				
				$(".dealerPic").attr("src",PIC_PREFIX+dPic+THUMBNAIL_SUFFIN);
				$(".dealerName").html(dName);
				$(".dealerAddress").html("地址："+dAddress);
				$(".dealerOwner").html("负责人："+dOwner);
				$(".dealerContact").html("联系方式："+dContact);
				$(".dealerNote").html(dNote);
	    		
	    		loading.hideLoading();
    		}else{
    			base.showMsg(res.msg)
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