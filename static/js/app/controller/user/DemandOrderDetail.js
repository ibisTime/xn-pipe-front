define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/qiniu/qiniu'
], function(base, Ajax, loading, qiniu) {
	var code = base.getUrlParam("code");
	var width = ( +$(window).width() - 20 ) / 3 - 12;
    var width1 = Math.ceil(width);
    var showImgContainer = $("#showImgContainer");
    var defaultImg = __inline("../images/default-img.png");
    var closeImg = __inline("../images/close-red.png");
    init();

    function init() {
        loading.createLoading();
		addListener();
		initUpload()
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


                var startDatetime = base.formatDate(res1.data.demand.startDatetime,"yyyy-MM-dd");//开始时间
				var endDatetime = base.formatDate(res1.data.demand.endDatetime,"yyyy-MM-dd");//结束时间
				var dPrice = res1.data.demand.price;//需求价钱
				var html ;
				var imgCtn
				var imgCtnArr = [];
				var file_id = []
				if (res1.data.pic) {
					imgCtnArr = res1.data.pic.split(/\|\|/);
					showImgContainer.show();
				}
				console.log(res1.data.status)
				if (res1.data.status == 0){
						for (var i = 0; i < imgCtnArr.length; i++) {
							imgCtn = $('<div class="wp33 pt10 plr6 p-r fl"  id="'+imgCtnArr[i]+'">'+
					                    '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
					                        '<img src="'+
					                        base.getImg2(imgCtnArr[i])
					                        +'" class="center-img wp100 hp100" data-src="'+imgCtnArr[i]+'" >'+
					                    '</div>'+
					                    '<div class="order-close-wrap">'+
					                        '<img src="'+closeImg+'" class="shan1">'+
					                    '</div>'+
					                    '<div class="write-progress-wrap"><div class="write-progress-up"></div></div>'+
					                '</div>').appendTo(showImgContainer);
							(function(imgCtn, key){
							    imgCtn.find('.order-close-wrap').on('click', function (e) {

							        if(showImgContainer.find(".order-close-wrap").length == 1){
		                                showImgContainer.hide();
		                            }
		                            var pic = $("#pic").val();
		                            pic = pic.split(/\|\|/);
		                            for(var i = 0; i < pic.length; i++){
		                                if(pic[i] == key){
		                                    pic.splice(i, 1);
		                                    break;
		                                }
		                            }
		                            $("#pic").val(pic.join("||"));
							        imgCtn.remove();
							    });
							})(imgCtn, imgCtnArr[i])

							var pic = $("#pic").val();
		                    if(pic)
		                        pic = pic + '||' + imgCtnArr[i];
		                    else
		                        pic = imgCtnArr[i];
		                    $("#pic").val(pic).valid();

						}
				}else{
					$(".construct").show();
					for (var i = 0; i < imgCtnArr.length; i++) {
						imgCtn = $('<div class="wp33 pt10 plr6 p-r fl"  id="'+imgCtnArr[i]+'">'+
				                    '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
				                        '<img src="'+
				                        // PIC_PREFIX+imgCtnArr[i]
				                        base.getImg2(imgCtnArr[i])
				                        +'" class="center-img wp100 hp100" data-src="'+imgCtnArr[i]+'" >'+
				                    '</div>'+
				                    '<div class="write-progress-wrap"><div class="write-progress-up"></div></div>'+
				                '</div>').appendTo(showImgContainer);
                	}
                	var inputB = '<input type="button" id="backBtn" value="返回" class="but wp100 fs15">'
                	$(".Btn").html(inputB);
                	$("#uploadContainer").hide();
                	$("#submitBtn").remove();
                	$("#backBtn").on("click",function(){
                		location.href = "./demand-order-list.html"
                	});
			}


				$(".order-code").html("订单号："+ocode);
				$(".order-uDate").html("下单时间："+oData);
				$(".order-stutas").html("订单状态："+oStutas);
				$(".order-remark").html("备注："+oRemark);
				$(".demandPic").attr("src",PIC_PREFIX+dPic+THUMBNAIL_SUFFIN);
				$(".demandName").html(dName);
				$(".demandName").attr("data-code",ddealerCode);
				$(".demandSummary").html(dSummary);
				$(".demandAddress").html("地点："+dAddress);
                $(".demandStartData").html("开始时间："+startDatetime);
				$(".demandEndData").html("结束时间："+endDatetime);
				$(".demandPrice").html("￥"+dPrice);
				$(".demandNote").html(dNote);
				$(".dorder-con").attr("href","demand-detail-dealer.html?code="+ddealerCode)
				// $("#showAvatar").attr("src",PIC_PREFIX+res1.data.pic)
				// $("#showAvatar").append(html)


	    		loading.hideLoading();
    		}else{
    			base.showMsg(res1.msg)
    		}
    	})

    	$("#submitBtn").on("click", function(){
    	    applyTravelNote();
    	});

    }

    function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}

// 	function initUpload(){
// 		qiniu.getQiniuToken()
// 			.then(function(res){
// 				if(res.success){
// 					token = res.data.uploadToken;
// 					qiniu.uploadInit({
// 						token: token,
// 						btnId: "uploadBtn",
// 						containerId: "uploadContainer",
// 						multi_selection: false,
// 						showUploadProgress: function(up, file){
// 							$(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
// 						},
// 						fileAdd: function(file){
// 							$(".upload-progress-wrap").show();
// 						},
// 						fileUploaded: function(up, url, key){
// 							$(".upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
// 							loading.createLoading("上传中...");
// 							uploadAvatar(url, key);
// 						}
// 					});
// 				}else{
// 					base.showMsg(res.msg || "token获取失败");
// 				}
// 			}, function(){
// 				base.showMsg("token获取失败");
// 			})
// 	}

// console.log(url, photo)
// 	function uploadAvatar(url, photo){
// 		Ajax.post("619063", {
// 			json: {
// 				"code": code,
// 				"pic": photo
// 			}
// 		}).then(function(res){
// 			loading.hideLoading();
// 			if(!res.success){
// 				base.showMsg(res.msg);
// 			}else{
// 				var html ;
// 				html+= '<img src="'+url+'" class="wp100 center-img1" >'
// 				$("#showAvatar").append(html)
// 			}
// 		}, function(){
// 			loading.hideLoading();
// 		});
// 	}

	function initUpload(){
	    qiniu.getQiniuToken()
	        .then(function(res){
	            if(res.success){
	                token = res.data.uploadToken;
	                qiniu.uploadInit({
	                    token: token,
	                    btnId: "uploadBtn",
	                    containerId: "uploadContainer",
	                    multi_selection: true,
	                    showUploadProgress: function(up, file){
	                        // $(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
	                        $("#" + file.id).find(".write-progress-wrap").show()
	                            .find(".write-progress-up").css("width", parseInt(file.percent, 10) + "%");
	                    },
	                    fileAdd: function(file, up){
	                        showImgContainer.show();
	                        var imgCtn = $('<div class="wp33 pt10 plr6 p-r fl" id="'+file.id+'">'+
	                                            '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
	                                                '<img src="'+defaultImg+'" class="center-img wp100 hp100">'+
	                                            '</div>'+
	                                            '<div class="order-close-wrap">'+
	                                                '<img src="'+closeImg+'" class="shan1">'+
	                                            '</div>'+
	                                            '<div class="write-progress-wrap"><div class="write-progress-up"></div></div>'+
	                                        '</div>').appendTo(showImgContainer);
	                        (function(imgCtn, id){
	                            imgCtn.find('.order-close-wrap').on('click', function (e) {
	                                up.removeFile(file);
	                                if(showImgContainer.find(".order-close-wrap").length == 1){
	                                    showImgContainer.hide();
	                                }
	                                var key = $("#" + id).find(".center-img").attr("data-src");
	                                var pic = $("#pic").val();
	                                pic = pic.split(/\|\|/);
	                                for(var i = 0; i < pic.length; i++){
	                                    if(pic[i] == key){
	                                        pic.splice(i, 1);
	                                        break;
	                                    }
	                                }
	                                $("#pic").val(pic.join("||"));
	                                imgCtn.remove();
	                            });
	                        })(imgCtn, file.id)
	                    },
	                    fileUploaded: function(up, url, key, file){
	                        $("#" + file.id).find(".write-progress-wrap").hide()
	                            .end().find(".center-img").attr("src", url )
	                            .attr("data-src", key).removeClass("hp100 wp100");
	                        var pic = $("#pic").val();
	                        if(pic)
	                            pic = pic + '||' + key;
	                        else
	                            pic = key;
	                        $("#pic").val(pic).valid();
	                    }
	                });
	            }else{
	                base.showMsg(res.msg || "token获取失败");
	            }
	        }, function(){
	            base.showMsg("token获取失败");
	        })
	}

	function applyTravelNote(){
	    loading.createLoading("上传中...");
	    var data = $("#travelForm").serializeObject();
	    data.code = code
	    console.log(data)
	    Ajax.post("619063", {
	        json: data

	    }).then(function(res){
	        loading.hideLoading();
	        if(res.success){
	  			location.href = './demand-order-list.html';
	        }else{
	            base.showMsg(res.msg);
	        }
	    }, function(){
	        loading.hideLoading();
	        base.showMsg("上传失败");
	    })
	}


});
