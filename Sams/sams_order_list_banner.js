try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        if (obj?.data) {
            // 场景 1：处理【订单列表】接口 (queryOrderLists)
            if (Array.isArray(obj.data.orderGroupDataList)) {
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
            if (obj.data.bannerInfo && !Array.isArray(obj.data.bannerInfo)) {
                delete obj.data.bannerInfo.deliveryDelayTipsNewList;
                delete obj.data.bannerInfo.deliveryDelayTips;
                if (Object.keys(obj.data.bannerInfo).length === 0) {
                    obj.data.bannerInfo = null;
                }
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
