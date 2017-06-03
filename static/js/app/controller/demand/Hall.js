define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll',
    'IScroll'
], function(base, Ajax, Foot, Handlebars, loading, citySelect, scroll,IScroll) {

    var myScroll, isEnd = false, isLoading = false,config={}, citylist,
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    
    var hallListTmpl =  __inline("../../ui/hall-list.handlebars");
    // var hallListTmpl0 =  __inline("../../ui/hall-list0.handlebars");
    var limit ;
    var navIndex = 0;
    var userId = base.getUserId();
    var lType;
    var config0 = {
        receiver: userId,
        start: 1,
        limit: 10,
        statusList: [91,92,2]
    }
    	
   		base.initLocation(function(event){
			var cLongitude = sessionStorage.getItem("dw-latitude");  
			var cLatitude = sessionStorage.getItem("dw-latitude"); 
				// console.log(event)
			config = {
		    	longitude: cLongitude,
				latitude: cLatitude,
				start: 1,
				limit: 10,
                type:""
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
     base.initLocation(initConfig, getInitData);
        addListener();
        getInitData();
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
		getHallList(true);
        // getDOrderList(true);
        getAgencyList(true)
        loading.hideLoading();
    }
    
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: function () {
                getHallList();
                getAgencyList()
                // getDOrderList()
        		loading.hideLoading();
            },
            refresh: function () {
                // var 
                if (navIndex == 0) {
                   getHallList(true);
               }else{
                    getAgencyList(true) 
               }
                
                // isEnd = false; 
                // lType = $(this).attr("l_type");
                // getHallList(true);
                // if ($("#lType2").hasClass("current")) {
                //     getDOrderList(config0,true);
                // }else{
                //   getHallList(true);  
                // }
                loading.hideLoading();
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
                        menuList();
                        var html,html1;
                        html =  '<div class="wp100" style="background: #f7f7f7;position: absolate;z-index: 999;">'+
                                    '<div id="down" class="mall-up-down down-arrow"></div>'+
                                    '<div id="allCont" class="hidden bg_fff">'+
                                        '<div class="t_666 ml-top-fl plr16 bg_fff b_bd_b s_12 bg_fff">所有分类</div>'+
                                        '<div id="allItem" class="plr16 bg_fff ml-top-item s_12 b_bd_t mt30 pr60">'+
                                            '<ul class="clearfix t_333">'+
                                               ' <li l_type="lType1" class="wp33 tl fl mtb6 current" >全部</li>'+
                                            '</ul>'+
                                        '</div>'+
                                        '<div id="mall-mask" class="mall-mask"></div>'+
                                    '</div>'+
                                    '<div id="mallWrapper" class="b_bd_b z_index999">'+
                                        '<div id="scroller">'+
                                            '<ul>'+
                                               ' <li l_type="lType1" class=" current" id="lType1">全部</li>'+
                                            '</ul>'+
                                       ' </div>'+
                                    '</div>'+
                                '</div>';
                        // for (var i = 0; i < list.length; i++) {
                        //     html1 = '<div class="wp100 show over-hide re mb4" style="top: 2.5rem">'+
                        //                 '<a href="./detail.html?code='+list[i].code+'" class="wp100 show over-hide">'+
                        //                     '<img src="{{formatListImage pic}}" class="wp100 com-img show">'+
                        //                     '<div class="wp100 plr15 ba p-r">'+
                        //                         '<div class="fs14 pt10 pb8">{{list[i].name}}</div>'+
                        //                        ' <div class="fs13 "> {{summary}}</div>'+
                        //                         '<div class="fs12 ptb6 co9">地点：{{province}}{{city}}{{area}} {{address}}</div>'+
                        //                         '<div class="fs12 co9">时间：{{formateDate startDatetime}}～{{formateDate endDatetime}}</div>'+
                        //                         '<div class="fs16 ptb15 red inline_block">￥{{price}}</div>'+
                        //                     '</div>'+
                        //                ' </a>'+
                        //                 '<div class="conBtn">';
                        //                     '<div class="Then-live tc lh27 inline_block p-a fs14 demandBtn" data-code="{{code}}" >确认接活</div>'+   

                        //                 '</div>'+
                        //                 '</div>';
                        //     if(!res.data.list.status && res.data.list.status !== 1){
                        //          $(".conBtn").html('<div class="Then-live0 tc lh27 inline_block p-a fs14 hidden">顺利结束</div>')
                        //     }else{
                        //          $(".conBtn").html('<div class="Then-live tc lh27 inline_block p-a fs14 demandBtn" data-code="'+list[i].code+'">确认接活</div>') 
                        //     }
                        // }

                        $("#needList")[refresh ? "html" : "append"](
                            hallListTmpl({items: list})
                            // html1
                            );
                        $("#needMenu").html(html)
                        config.start++;
                    }else{
                        if(refresh){
                            $("#needList").html('<div class="item-error">暂无需求</div>');
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
                        $("#needList").html('<div class="item-error">暂无需求</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }

        // function getDOrderList(refresh){
        //     if(!isLoading && (!isEnd || refresh) ){
        //         isLoading = true;
        //         base.showPullUp();
        //         config0.start = refresh && 1 || config0.start;
        //         return Ajax.get("619070", config0, !refresh)
        //             .then(function(res){
        //                 if(res.success && res.data.list.length){
        //                     var list = res.data.list;
        //                     if(list.length < config0.limit){
        //                         isEnd = true;
        //                     }
        //                     $("#needList")[refresh ? "html" : "append"](hallListTmpl({items: list}));

        //                     config0.start++;
        //                 }else{
        //                     if(refresh){
        //                         $("#needList").html('<div class="item-error">暂无需求</div>');
        //                     }
        //                     isEnd = true;
        //                     res.msg && base.showMsg(res.msg);
        //                 }
        //                 base.hidePullUp();
        //                 myScroll.refresh();
        //                 isLoading = false;

        //                 loading.hideLoading();
        //             }, function(){
        //                 isLoading = false;
        //                 isEnd = true;
        //                 if(refresh){
        //                     $("#needList").html('<div class="item-error">暂无需求</div>');
        //                 }
        //                 base.hidePullUp();
        //                 myScroll.refresh();
        //                 loading.hideLoading();
        //             });
        //     }
        // }


    function getAgencyList(refresh){
        if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("619014", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#needMenu").html("");
                        $("#needList")[refresh ? "html" : "append"](hallListTmpl({items: list}));
                        config.start++;
                    }else{
                        if(refresh){
                            $("#needList").html('<div class="item-error">暂无经销商</div>');
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
                        $("#needList").html('<div class="item-error">暂无经销商</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }

    function menuList(){
        var param = {
            "parentKey": "demand_type",
            "type": "1",
            "dkey": ""
        }
        Ajax.post("807706", { json:param })
            .then(function(res) {
                if (res.success) {
                    var cateData = res.data;
                    var scroller = $("#scroller");
                    for (var i = 0; i < cateData.length; i++) {
                        var d = cateData[i],
                        html="",
                        html1="";
                        html += '<li l_type="' + d.dkey + '">' + d.dvalue + '</li>';
                        html1 += '<li l_type="' + d.dkey + '" class="wp33 tl fl mtb6">' + d.dvalue + '</li>';
                        scroller.find("ul").append(html);
                        $("#allItem").find("ul").append(html1);
                    }
                    addMenu();
                    // cate == cate || cateData[0].code;
                    // scroller.find("ul>li[l_type='']").click();
                }
            });
    }

    function addMenu() {
        var scroller = $("#scroller");
        var lis = scroller.find("ul li");
        for (var i = 0, width = 0; i < lis.length; i++) {
            width += $(lis[i]).width() + 29;
        }
        $("#scroller").css("width", width);
        myScroll = new IScroll('#mallWrapper', { scrollX: true, scrollY: false, mouseWheel: true, click: true });
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

        $("#content").on("click",".demandBtn0",function(){
            var thishref = $(this).attr("href");
         })
}

    $(".orderNavBar").on('click','.orderNav',function(){

        $(this).addClass("red").addClass("order").siblings(".orderNav").removeClass("red").removeClass("order");
    });

    $(".orderNav").on("click",function(){
        var thisINdex = $(this).index();
        if(navIndex == thisINdex){
            getHallList(true);
            // getDOrderList(true);       
        }else{
            getAgencyList(true);
        }
    })

    /**大类start */
    $("#content").on("click","#down",function(){
       var me = $(this);
       if (me.hasClass("down-arrow")) {
           $("#allCont").removeClass("hidden");
           me.removeClass("down-arrow").addClass("up-arrow");
       } else {
           $("#allCont").addClass("hidden");
           me.removeClass("up-arrow").addClass("down-arrow");
       } 
    })
    $("#content").on("click","#mall-mask",function(){
        $("#down").click();
    })
    $("#content").on("click","#allItem li",function(){
        lType = $(this).attr("l_type");
        $("#scroller").find("li[l_type='" + lType + "']").click();
        $("#down").click();
    })
    $("#content").on("click","#scroller li",function(e){
        addMenu()
        var me = $(this);
        $("#mallWrapper").find(".current").removeClass("current");
        me.addClass("current");
        myScroll.scrollToElement(this);
        lType = me.attr("l_type");
        config.type = lType;
        // console.log(lType)
        start1 = 1;
        if(lType == "lType1"){
             config.type = "";
            getHallList(config)

        }else{
            getHallList(config)
        }
        var allItem = $("#allItem");
        allItem.find("li.current").removeClass("current");
        me.find("li[l_type='" + lType + "']").addClass("current");
        e.stopPropagation()
    })
    /**大类end */

});