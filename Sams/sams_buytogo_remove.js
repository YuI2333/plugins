try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        if (obj?.data) {
            // 1. 彻底斩草除根：去除“省心带一件”模块
            if (obj.data.buyToGoInfo) {
                delete obj.data.buyToGoInfo;
            }
            
            // 2. 彻底斩草除根：去除顶部“天气延迟”横幅，消除空白 UI 占位
            if (obj.data.bannerInfo) {
                // 删除具体的字段，而不是清空
                delete obj.data.bannerInfo.deliveryDelayTipsNewList;
                delete obj.data.bannerInfo.deliveryDelayTips;
                
                // 如果 bannerInfo 里没别的东西了，连着外壳一起干掉，或者置空
                if (Object.keys(obj.data.bannerInfo).length === 0) {
                    obj.data.bannerInfo = null; 
                    // 很多 App 判断 bannerInfo 为 null 时才会完全折叠 UI 高度
                }
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆确认订单页净化脚本运行异常: " + error);
    $done({});
}
