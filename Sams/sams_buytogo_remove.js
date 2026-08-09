try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        if (obj?.data) {
            // 1. 去除“省心带一件”模块
            if (obj.data.buyToGoInfo) {
                delete obj.data.buyToGoInfo;
            }
            
            // 2. 去除顶部“天气原因订单延迟”滚动提示
            if (obj.data.bannerInfo) {
                if (obj.data.bannerInfo.deliveryDelayTipsNewList) {
                    obj.data.bannerInfo.deliveryDelayTipsNewList = [];
                }
                if (obj.data.bannerInfo.deliveryDelayTips) {
                    obj.data.bannerInfo.deliveryDelayTips = "";
                }
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆确认订单页净化脚本运行异常: " + error);
    // 发生异常时静默退出，不影响 App 正常网络请求
    $done({});
}
