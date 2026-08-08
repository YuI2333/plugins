let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        let modified = false;

        // 核心逻辑：只在真真切切下发了“穿插关键词”时，才去干预！
        if (obj.data && obj.data.trySearchKeywordResponse && Array.isArray(obj.data.trySearchKeywordResponse.dataList)) {
            
            // 判断如果有关键词，才执行删除操作
            if (obj.data.trySearchKeywordResponse.dataList.length > 0) {
                // 场景 A：正常搜到了商品，且带有推荐词（第一版证明了此时删除是最完美的）
                delete obj.data.trySearchKeywordResponse;
                modified = true;
            }
        }
        
        // 只有修改过的数据，才需要重新封包返回
        if (modified) {
            $done({ body: JSON.stringify(obj) });
        } else {
            // 场景 B：空页面、敏感词、乱码搜索，本来就没有下发关键词。
            // 此时我们【绝对不碰】数据包，原封不动放行，彻底杜绝 JSON.stringify 引起的解析异常！
            $done({});
        }
    } catch (err) {
        $done({}); // 遇到任何 JS 解析异常，也原样放行，保底不断网
    }
} else {
    $done({});
}
