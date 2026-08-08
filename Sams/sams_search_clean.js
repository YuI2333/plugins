let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 定位并移除搜索结果中穿插的关键词卡片节点
        if (obj.data && obj.data.trySearchKeywordResponse) {
            delete obj.data.trySearchKeywordResponse;
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (err) {
        $done({ body });
    }
} else {
    $done({});
}
