define([], function() {
    var dict = {

        /*
        TO_PAY("0", "待支付"), USER_CANCEL("91", "最终状态-用户不支付取消订单"), OVERDUE_CANCEL(
            "92", "最终状态-过期取消订单"), PLAT_CANCEL("93", "最终状态-平台取消订单"), PAY_YES(
            "1", "已支付"), TO_REFUND("2", "待退款"), REFUND_YES("94", "最终状态-退款成功"), REFUND_NO(
            "31", "退款失败(已第一次确认)"), WILL_DONE("32", "已第一次确认(接单/入住/发货/...)"), DONE(
            "4", "已完成");
        */ 

        // 酒店订单
        hotelOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "入住",
            "91": "取消订单",
            "92": "取消订单",
            "93": "平台取消订单",
            "94": "退款成功"
        },
        // 线路订单
        lineOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已参与",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 专线订单
        specialLineOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已上车",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 大巴订单
        busStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已接单",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 拼车订单
        carpoolStatus: {
            "0": "待支付定金",
            "1": "已支付定金",
            "2": "待支付尾款",
            "3": "已支付尾款",
            "4": "取消订单",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "取消订单",
            "95": "黑名单",
            "96": "已完成",
            "97": "待支付定金"
        },
        // 商品订单
        commodityStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "发货",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 游记状态
        travelNoteStatus: {
            "0": "待审核",
            "1": "审核通过",
            "2": "审核不通过"
        },
        // 评论状态
        commentStatus: {
            "0": "用户发布未审核", 
            "1": "通过",
            "2": "不通过"
        },
        //积分流水
        integralStatus:{
        	"-30": "兑换", 
        	"30": "购物",
        	"01": "注册送积分", 
        	"02": "每日签到"
        }
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});