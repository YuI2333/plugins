let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 定位到穿插的关键词卡片节点
        if (obj.data && obj.data.trySearchKeywordResponse) {
            // 保留节点结构，仅清空关键词数组和数量，避免 App 字段解析异常报错
            if (Array.isArray(obj.data.trySearchKeywordResponse.dataList)) {
                obj.data.trySearchKeywordResponse.dataList = [];
            }
            obj.data.trySearchKeywordResponse.totalCount = 0;
            // pageSize 等其他无关痛痒的字段原样保留，以防万一
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (err) {
        // 如果 JSON 解析报错，原样返回防止阻断
        $done({ body });
    }
} else {
    $done({});
}
