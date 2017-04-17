define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	var code = base.getUrlParam("code");

	init();
	function init(){
		loading.createLoading();
		Ajax.get("619086",{
			"code":code
		}).then(function(res){
			 	if(res.success){
//			 		$("#newsPic").attr("src",PIC_PREFIX+res.data.pic)
			 		$("#udata").html(base.formatDate(res.data.updateDatetime,"yyyy-MM-dd"))
			 		$("#title").html(res.data.title)
				 	$("#content").html(res.data.content);
				}else{
					base.showMsg("加载失败");
				}
			 	loading.hideLoading();
			}, function(){
			 	base.showMsg("加载失败");
			 	loading.hideLoading();
			});
	}
});