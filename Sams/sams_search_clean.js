try {
    let obj = JSON.parse($response.body);
    
    if (obj && obj.data) {
        // 去除“试试搜这些”
        if (obj.data.trySearchKeywordResponse) {
            delete obj.data.trySearchKeywordResponse;
        }
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}