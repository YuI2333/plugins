try {
    let obj = JSON.parse($response.body);
    
    if (obj.recommend_queries) obj.recommend_queries.queries = [];
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
