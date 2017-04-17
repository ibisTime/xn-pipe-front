define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/scroll/scroll',
    'app/util/handlebarsHelpers'
], function(base, Ajax, loading, showImg, scroll, Handlebars) {
	var infos = [];//商品
	var goodsSum = 10;//商品总数
	
	var tmpl = __inline("../../ui/cart-items.handlebars");

    init();

    function init() {
        loading.createLoading();
        getMyCart();
        initIScroll();
        addListener();

    }

    function addListener() {
    	//选中
    	$(".cart-radio").on("click",function(){
    		if($(this).hasClass("on")){
    			$(this).removeClass("on");
    		}else{
    			$(this).addClass("on");
    		}
    	});
    	
    	//减
		$(".cart-sub").on("click",function(){
			var cartNum = $(".cart-num").val();
			
			if(cartNum<=1){
				cartNum = 1;
				$(this).removeClass("on");
				base.showMsg("商品不能再减少");
			}else{
				cartNum --;
				$(this).addClass("on");
				$(".cart-num").val(cartNum)
			}
		})
		
		//加
		$(".cart-add").on("click",function(){
			var cartNum = $(".cart-num").val();
			
			if(cartNum>=goodsSum){
				cartNum = goodsSum;
				$(this).removeClass("on");
				base.showMsg("商品不能再增加");
			}else{
				cartNum ++;
				$(this).addClass("on");
				$(".cart-num").val(cartNum)
			}
		})
		
    	//删除
    	$(".cart-remove").on("click",function(e){
            e.stopPropagation();
            var that = this;
            base.confirm("确定删除商品吗？")
                .then(function () {
                    
                })
    	});
    	
    	//全选按钮
        $(".cart-bR").on("click", function() {
            var flag = false,
                me = $(this),
                doAction = "removeClass";
            if (me.hasClass("on")) {
                me.removeClass("on");
            } else {
                me.addClass("on");
                flag = true;
                doAction = "addClass";
            }
            //点击全选后，每种商品前面的勾选框也相应变化
            $("#cartWrap div.cart-wrap div.cart-radio")
                .each(function(i, item) {
                    $(item)[doAction]("on");
                });
            //如果目前处于全选状态，则更新页面底部的总价
            if (flag) {
                var t = 0;
                for (var i = 0; i < infos.length; i++) {
                    t += infos[i];
                }
                $("#totalAmount").text(base.fZeroMoney(t));
                //否则把页面底部总价置为0
            } else {
                $("#totalAmount").text("0");
            }
        });
    	
		
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyUpScroll({
            refresh: function () {
                myScroll.refresh();
            }
        });

    }
	
	//获取购物车商品
	function getMyCart(){
		loading.hideLoading();
	}
});