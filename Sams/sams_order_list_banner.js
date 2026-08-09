try {
    if ($response && $response.body) {
        let url = $request.url;
        let obj = JSON.parse($response.body);
        
        if (obj?.data) {
            
            // 场景 1：处理【订单列表】接口 (queryOrderLists)
            if (url.includes("queryOrderLists") && Array.isArray(obj.data.orderGroupDataList)) {
                for (let i = 0; i < obj.data.orderGroupDataList.length; i++) {
                    let group = obj.data.orderGroupDataList[i];
                    if (Array.isArray(group?.orders)) {
                        for (let j = 0; j < group.orders.length; j++) {
                            let order = group.orders[j];
                            if (order?.bannerInfo) {
                                delete order.bannerInfo.deliveryDelayTipsNewList;
                                delete order.bannerInfo.deliveryDelayTips;
                                if (Object.keys(order.bannerInfo).length === 0) {
                                    order.bannerInfo = null;
                                }
                            }
                        }
                    }
                }
            }
            
            // 场景 2：处理【订单详情】接口 (queryOrderDetail)
            else if (url.includes("queryOrderDetail") && obj.data.bannerInfo) {
                delete obj.data.bannerInfo.deliveryDelayTipsNewList;
                delete obj.data.bannerInfo.deliveryDelayTips;
                if (Object.keys(obj.data.bannerInfo).length === 0) {
                    obj.data.bannerInfo = null;
                }
            }
            
            // 场景 3：处理【天气接口】(getWeather) -> 彻底干掉天气数据
            else if (url.includes("getWeather")) {
                // 斩草除根：干掉天气状态、温度、风力、湿度和所有提示
                delete obj.data.weather;
                delete obj.data.weatherEum;
                delete obj.data.temperature;
                delete obj.data.windpower;
                delete obj.data.winddirection;
                delete obj.data.humidity;
                delete obj.data.shippedWeatherTips;
                delete obj.data.unshippedWeatherTips;
                // 仅保留 province 和 city，防止 App 获取不到基础定位字段而崩溃
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆订单相关页面净化脚本运行异常: " + error);
    $done({});
}
