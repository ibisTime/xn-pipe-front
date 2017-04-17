define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/searchMap/searchMap',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, showImg, searchMap, scroll) {
	var dCity = "",startSite = {
		name:"",
		point:{lng:"",lat:""}
	};
	
    init();
	
	loading.createLoading();

    function init() {

        getOption($("#ageSelect"),100);
        addListener();
    }

    function addListener() {
    	
    	searchMap.addMap();
	
		$.when(
			base.getUser(),
			base.getDictList("occupation")
		).then(function(res,res1){
				if(res.success && res1.success){
					var optionV = "";
					for (var i=0 ; i < res1.data.length; i++) {
						optionV += '<option value="'+res1.data[i].dkey+'">'+res1.data[i].dvalue+'</option>'
					}
					
					$("#position").html(optionV);
					
					if(res.data.userExt.address){
						var gender = res.data.userExt.gender;
						var birthday = res.data.userExt.birthday;
						var workTime = res.data.userExt.workTime;//工作年限
	                	var diploma = res.data.userExt.diploma;//有无电工证
						var position = res.data.userExt.occupation;//职位
		                    startSite.name = res.data.userExt.address;
		                    startSite.point.lng= res.data.userExt.longitude,
		                    startSite.point.lat= res.data.userExt.latitude;
		                
		                $(".info-radio").each(function(){
		                	if($(this).attr("data-sex")==gender){
		                		$(this).removeClass("radio").addClass("radioCur")
		                		.siblings(".info-radio").removeClass("radioCur").addClass("radio");
		                	}else if($(this).attr("data-val")==diploma){
		                		$(this).removeClass("radio").addClass("radioCur")
		                		.siblings(".info-radio").removeClass("radioCur").addClass("radio");
		                	}
		                })
		                
		                $(".address").html(res.data.userExt.address);
			            
			            $("#workTime option").each(function(){
			            	if($(this).val()==workTime){
			            		$(this).attr("selected",true)
			            	}
			            })
			            $("#ageSelect option").each(function(){
			            	if($(this).html()==birthday){
			            		$(this).attr("selected",true)
			            	}
			            })
			            $("#position option").each(function(){
			            	if($(this).val()==position){
			            		$(this).attr("selected",true)
			            	}
			            })
			            
			            $("#ageSelectShow").html($("#ageSelect option:selected").html())
    		
						$("#workTimeShow").html($("#workTime option:selected").html())
						
						$("#positionShow").html($("#position option:selected").html())
			            
			            loading.hideLoading();
						
					}else{
						loading.hideLoading();
					}
				}else{
					$(".address").html("请选择");
					$("#positionShow").html(res1.data[0].dvalue)
					loading.hideLoading();
				}
			})
    	
    	//性别
    	$(".info-radio").click(function(){
    		if($(this).hasClass("radio")){
    			$(this).removeClass("radio").addClass("radioCur").siblings(".info-radio").removeClass("radioCur").addClass("radio");
    		}
    	});
    	
    	$("#ageSelect").change(function(){
    		
    		$("#ageSelectShow").html($("#ageSelect option:selected").html())
    		
    	})
    	
    	$("#workTime").change(function(){
    		
    		$("#workTimeShow").html($("#workTime option:selected").html())
    		
    	})
    	
    	$("#position").change(function(){
    		
    		$("#positionShow").html($("#position option:selected").html())
    		
    	})
    	
    	
    	//地址 
    	$("#address").click(function(){
    		searchMap.showMap({
        		point: startSite.point,
        		text: startSite.name,
                showDw: true,
        		success: function (point, text) {
	        		startSite.name = text;
	        		startSite.point.lng = point.lng;
	        		startSite.point.lat = point.lat;
	        		$(".address").html(text);
	        	}
        	});
    	});

    	//保存
		$("#btn-sub").click(function(){
			
            var param = {
                "userId": base.getUserId(),
                "gender": $(".info-sex.radioCur").attr("data-sex"),//性别
                "birthday": $("#ageSelect option:selected").html(),//年龄
                "email": "d@hichengdai.com",//默认
                "workTime": $("#workTime option:selected").val(),//工作年限
                "occupation": $("#position option:selected").val(),//职业
                "diploma": $(".info-diploma.radioCur").attr("data-val"),//有无电工证
                "address": $(".address").html()
            };
            
            var param1 = {
                "userId": base.getUserId(),
                "longitude": startSite.point.lng,
                "latitude": startSite.point.lat
            };

            if($(".province").html()=="请选择"){
                base.showMsg("请选择地址");
            } {
            	$.when(
            		Ajax.post("805156",{json: param}),
            		Ajax.post("805158",{json: param1})
            	).then(function (res, res1) {
                        if(res.success && res1.success){
                        	base.showMsg("个人信息保存成功");
                        	
                        	setTimeout(function(){
								location.href = document.referrer;
                        	},800)
                        }else {
                            base.showMsg(res.msg && res1.msg );
                        }
                    },function () {
                        base.showMsg("保存失败");
                    })
            }

		});

    }
    //年龄
    function getOption(obj,num){
    	var s = "";
    	for (var j = 19 ; j < num ;j++) {
    		s+="<option>"+j+"</option>";
    	}
        obj.append(s);
        loading.hideLoading();
    }
    
});