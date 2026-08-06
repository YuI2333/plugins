try {
    let obj = JSON.parse($response.body);
    
    // 直接彻底删除整个推荐节点，破坏客户端的缓存触发逻辑
    delete obj.recommend_queries;
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
