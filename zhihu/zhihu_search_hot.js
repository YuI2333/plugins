try {
    let obj = JSON.parse($response.body);
    
    // 清空推荐查询词数组
    if (obj.recommend_queries && Array.isArray(obj.recommend_queries.queries)) {
        obj.recommend_queries.queries = [];
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
