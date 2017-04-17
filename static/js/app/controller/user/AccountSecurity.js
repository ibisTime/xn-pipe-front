define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/validate/validate',
    'app/module/qiniu/qiniu',
    'app/module/identity/identity',
    'app/module/bindMobile/bindMobile',
    'app/module/changeMobile/changeMobile',
    'app/module/changeNickName/changeNickName',
    // 'app/module/setTradePwd/setTradePwd',
    'app/module/changePwd/changePwd'
], function(base, Ajax, loading, Validate, qiniu, Identity,
			BindMobile, ChangeMobile, ChangeNickName, ChangePwd) {
	var token, nickname, mobile, identityFlag, tradeFlag;
	
	init();
	function init(){
		loading.createLoading();
		base.getUser()
			.then(function(res){
				loading.hideLoading();
				if(res.success){
					$("#showAvatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
					nickname = res.data.nickname;
					$("#nick").text(nickname);
					ChangeNickName.addNickCont({
						success: function(res){
							nickname = res;
							$("#nick").text(nickname);
						},
						error: function(msg){
							base.showMsg(msg);
						},
						defaultName: nickname
					});
                    console.log(res.data.mobile)
                    
                    if(res.data.mobile==""||res.data.mobile==null){
                        $("#mobileName").html("绑定手机号");
                    }else {
                    	mobile = res.data.mobile;
                    	$("#mobileName").text("修改手机号");
                        $("#mobileDetail").text(mobile);
                    }
					
					ChangeMobile.addMobileCont({
						success: function(res){
							mobile = res;
							$("#mobileDetail").text(mobile);
						},
						error: function(msg){
							base.showMsg(msg);
						}
					});
					
					BindMobile.addMobileCont({
			            success: function(res) {
			            	mobile = res;
			            	$("#mobileName").text("修改手机号");
                        	$("#mobileDetail").text(mobile);
			            },
			            hideFn: function() {
			            },
			            error: function(msg) {
			                base.showMsg(msg);
			            }
			        });

					addListener();

					initUpload();
				}else{
					base.showMsg(res.msg || "用户信息获取失败");
				}
			}, function(){
				base.showMsg("用户信息获取失败");
			});
	}

	function addListener(){
		$("#nickWrap").on("click", function(){
			ChangeNickName.showNickCont();
		});
		$("#mobileWrap").on("click", function(){
			if(mobile){
				ChangeMobile.showMobileCont();
			}else{
				BindMobile.showMobileCont();
			}
		});
        $("#identityWrap").on("click", function(){
			Identity.showIdentity();
		});
		$("#changPwdWrap").on("click", function(){
			ChangePwd.showCont();
		});
  	}

	function initUpload(){
		qiniu.getQiniuToken()
			.then(function(res){
				if(res.success){
//					console.log(res.data);
					token = res.data.uploadToken;
					qiniu.uploadInit({
						token: token,
						btnId: "uploadBtn",
						containerId: "uploadContainer",
						multi_selection: false,
						showUploadProgress: function(up, file){
							$(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
						},
						fileAdd: function(file){
							$(".upload-progress-wrap").show();
						},
						fileUploaded: function(up, url, key){
							$(".upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
							loading.createLoading("上传中...");
							uploadAvatar(url, key);
						}
					});
				}else{
					base.showMsg(res.msg || "token获取失败");
				}
			}, function(){
				base.showMsg("token获取失败");
			})
	}

	function uploadAvatar(url, photo){
		Ajax.post("805077", {
			json: {
				"userId": base.getUserId(),
				"photo": photo
			}
		}).then(function(res){
			loading.hideLoading();
			if(!res.success){
				base.showMsg(res.msg);
			}else{
				$("#showAvatar").attr("src", url);
			}
		}, function(){
			loading.hideLoading();
		});
	}
});