let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 匹配并清空顶部天气延迟提示数据
        if (obj.data && obj.data.bannerInfo) {
            if (obj.data.bannerInfo.deliveryDelayTipsNewList) {
                obj.data.bannerInfo.deliveryDelayTipsNewList = [];
            }
            if (obj.data.bannerInfo.deliveryDelayTips) {
                obj.data.bannerInfo.deliveryDelayTips = "";
            }
        }
        
        body = JSON.stringify(obj);
    } catch (e) {
        console.log("山姆购物车去横幅脚本解析错误: " + e);
    }
}

$done({ body });
