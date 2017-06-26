define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/foot/foot',
    'app/module/bindMobile/bindMobile'
], function(base, Ajax, Handlebars, loading, Foot, BindMobile) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';

    var userId = base.getUserId();
    var findContent =[],contenIndex = [];

    var refreshTime;
    var hearStatus = 0;

	var uNum,dUserMobile;

    init();

	$("#chatAudio").load();

    function init() {
        Foot.addFoot(2);
        loading.createLoading();

        getInit();

        if($("#list2").hasClass("hidden") && hearStatus != 0){//以派单显示隐藏控制定时器
	        refreshTime = setInterval(function(){
	        	console.log(2)
		        getUserStatus();
			},2000);
		}

        addListener();
    }

	function getInit(){
		base.getDictList("find_content")
    		.then(function(res){
    			var arr = res.data;
    			var str = [];
    			var temp = "";

    			for (var i=0 ; i<arr.length ; i++){
    				str.push(arr[i].dkey);

					var s = "";
					s+="<div class='fs13 wp33 lh40 tc fl pr15 pb15 contentList'>";
		            s+="<div class='wp100 b-ad job-item cList'>";
		            s+="<div class='inline_block'>"+dictArray(arr[i].dkey*1,arr)+"</div></div></div>";

					temp += s;
				}
				$("#content").html(temp);
				getInitData();
    		})
	}

	//第一次进入页面加载信息
	function getInitData(){
		$.when(
			Ajax.get("619050",{
			"userId":userId
			}),
			base.getDictList("find_content")
		).then(function(res1,res2){
			if(res1.success && res2.success){

				if(res1.data.hear.content!=null){
					findContent = res1.data.hear.content;
					getContentList(findContent,res2.data);
				}

				//判断听单状态
				if(res1.data.hear.status == 1){//听单中

					hearStatus =1;
					getFind($("#find"));
					$(".contentList").each(function(){
		        		if(!$(this).children(".job-item").hasClass("active")){
		        			$(this).children(".job-item").removeClass("cList");
		        		}
		           	})

					refreshTime = setInterval(function(){
				        getUserStatus();
					},2000);

					loading.hideLoading();

				}else if(res1.data.hear.status == 2){//派单中

					hearStatus = 2;
    				clearInterval(refreshTime);

    				getAssign(res1.data.assign);

					$("#find").hide();
					$("#list1").hide();
        			$("#list2").removeClass("hidden").fadeIn(200);

        			loading.hideLoading();
				}else{//未听单

					hearStatus = 0;
        			clearInterval(refreshTime);
					loading.hideLoading();
				}

			}else{
				loading.hideLoading();
				base.showMsg(res1.msg)
			}
		})
	}

	//ajax 请求
	function getUserStatus(){
		Ajax.get("619050",{
		"userId":userId,
		},false).then(function(res){
			if(res.success){

				if(res.data.hear.content && res.data.hear.status!= 0){//选中找活内容
					findContent = res.data.hear.content;

					//判断听单状态
					if(res.data.hear.status == 1){//听单中

						hearStatus = 1;
						getFind($("#find"));
						loading.hideLoading();

					}else if(res.data.hear.status = 2){//派单中

						hearStatus = 2;

        				clearInterval(refreshTime);
        				getAssign(res.data.assign);
        				$("#chatAudio")[0].play();

						$("#find").hide();
						$("#list1").hide();
	        			$("#list2").fadeIn(200);

	        			loading.hideLoading();
					}else{

						hearStatus =0;
	        			loading.hideLoading();
					}
				}

			}else{
				loading.hideLoading();
				base.showMsg(res.msg)
			}
		})
	}

	//获取需求详情
	function getAssign(data){
		var data = data;
		var dPic = data.demand.pic;//需求图片
		var dName = data.dealer.name;//经销商
		var dSummary = data.demand.summary;//需求简述

		var dAddress = data.demand.address;//地址

		var dData = base.formatDate(data.demand.startDatetime,"yyyy-MM-dd");//开始时间
		var dPrice = data.demand.price;//需求价钱

		$(".demandPic").attr("src",PIC_PREFIX+dPic+THUMBNAIL_SUFFIN);
		$(".demandName").html(dName);
		$(".demandSummary").html(dSummary);
		$(".demandAddress").html("地点："+dAddress);
		$(".demandData").html("时间："+dData);
		$(".demandPrice").html("￥"+dPrice);
		$(".list2").attr("href","../demand/detail.html?code="+data.demandCode);
	}

	//找活内容
	function getContentList(dkey,arrayData){
		var str = dkey;
		var arr = str.split(",");

		for (var i=0 ; i<arr.length ; i++){
			$(".contentList").eq(arr[i]*1).children(".cList").addClass("active");
		}
	}

    function addListener() {

    	BindMobile.addMobileCont({
            success: function(res) {
            	dUserMobile = res;
            },
            hideFn: function() {
            },
            error: function(msg) {
                base.showMsg(msg);
            }
        });

        $("#content").on("click", ".cList", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var _self = $(this);
            _self[_self.hasClass("active") ? "removeClass" : "addClass"]("active");
        });

        //开始找活
        $("#find").on("click", function () {

            contenIndex = [];
        	var _find = $(this);

			$(".contentList").each(function(){
        		if($(this).children(".job-item").hasClass("active")){
        			contenIndex == "" ? contenIndex += $(this).index() : contenIndex += ","+$(this).index();
        		}
        	})
			base.getUserInfo()
				.then(function(res){
					if(res==1){
						if(contenIndex!=""){
							var param = {
				           		"userId": userId,
				    			"content": contenIndex,
                                "latitude": sessionStorage["latitude"],
                                "longitude": sessionStorage["longitude"]
				        	}

							getFind(_find);

	    					Ajax.post("619040",{json: param})
	    					.then(function(res1){
	    						if(res1.success){

					           		hearStatus = 1;

					           		$(".contentList").each(function(){
						        		if(!$(this).children(".job-item").hasClass("active") && contenIndex!=""){
						        			$(this).children(".job-item").removeClass("cList");
						        		}
					           		})

					           		if($("#list2").hasClass("hidden") && hearStatus != 0){//以派单显示隐藏控制定时器
							        	refreshTime = setInterval(function(){
								        	getUserStatus();
								        },1000);
								    }
	    						}else{
	    							base.showMsg(res1.msg)
	    						}
	    					})

	    				}else{
			        		base.showMsg("请选择找活内容")
			        	}

			    	}
				},function(){

				})

        });

        //停止找活
        $("#stopIcon").on("click", function () {

            Ajax.get("619041",{
            	"userId": userId,
            },false).then(function(res){
            	if(res.success){

            		hearStatus = 0;
            		contenIndex = [];
		        	clearInterval(refreshTime);

		            $("#waitIcon, #stopIcon").removeClass("active");
		            $("#find").fadeIn(200);

	    			$(".contentList").each(function(){
		        		if(!$(this).children(".job-item").hasClass("cList")){
		        			$(this).children(".job-item").addClass("cList");
		        		}
		           	})

            	}else{
            		base.showMsg(res.msg)
            	}

	    	})

        });

        //拒绝接单
        $("#cancelBtn").on("click", function () {

        	Ajax.get("619027",{
        		"userId":userId
        	},false).then(function(res){

            	if(res.success){
            		hearStatus = 1;

		            $("#waitIcon, #stopIcon").removeClass("active");
//		            $("#find").show();
		            $("#list2").hide();
		            $("#list1").show();

		        	refreshTime = setInterval(function(){
			        	getUserStatus();
			        },1000);

            	}else{
            		base.showMsg(res.msg)
            	}

	    	})

        });

        //接单
        $("#getBtn").on("click", function () {

        	Ajax.post("619026",{
        		json:{"userId":userId}
        	}).then(function(res){
            	if(res.success){

            		hearStatus = 0;
		        	clearInterval(refreshTime);
		            base.showMsg("接单成功");
		            setTimeout(function(){
		            	location.href = "../user/demand-order-list.html";
		            },800)

            	}else{
            		base.showMsg(res.msg)
            	}

	    	})

        });
    }

	//听单
	function getFind(obj){
            obj.fadeOut(200);
            $("#waitIcon, #stopIcon").addClass("active");

	}

	function dictArray(dkey,arrayData){//数据字典

		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}

});
