define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, Handlebars, loading, citySelect, scroll) {

    var myScroll, isEnd = false, isLoading = false,config={}, citylist,
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    
    var hallListTmpl =  __inline("../../ui/hall-list.handlebars");
    var limit ;
    	
   		base.initLocation(function(){
			var cLongitude = sessionStorage.getItem("dw-longitude");  
			var cLatitude = sessionStorage.getItem("dw-latitude"); 
				
			config = {
		    	longitude: cLongitude,
				latitude: cLatitude,
				start: 1,
				limit: 10
		    }
			
			$.when(
				Ajax.get("619917",{
        		"ckey": "limit"
        		},false),
				init()
			).then(function(res){
        		limit=res.data.cvalue;
			})
			
		},function(res){
			 base.showMsg("获取地址失败");
		})
    
    
    function init() {
    	loading.createLoading();
        Foot.addFoot(1);
        initIScroll();
//      base.initLocation(initConfig, getInitData);
        addListener();
        getInitData();
    }
//  function initConfig(result) {
//      citylist = result;
//      citySelect.addCont({
//          cityList: citylist,
//          success: function (city) {
//              $("#headDW").text(city);
//          }
//      });
//      getInitData();
//  }
    
    function getInitData() {
		getHallList(true);
        loading.hideLoading();
    }
    
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: function () {
                getHallList();
        		loading.hideLoading();
            },
            refresh: function () {
                isEnd = false;          
                getHallList(true);
            }
        });
        
    }
    
    function getHallList(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619033", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](hallListTmpl({items: list}));
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
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无需求</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }
    	
    function addListener() {
    	
    	$("#content").on("click",".demandBtn",function(){
    		var thisCode = $(this).attr("data-code");
    		var n;
    		
    		base.getUserInfo1(limit,function(){
				var param = {
	    			"code": thisCode,
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
    
});