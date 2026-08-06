try {
    let obj = JSON.parse($response.body);
    
    // 清空搜索框下方的热词列表数据源
    if (obj.recommend_queries) {
        obj.recommend_queries.queries = [];
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
