try {
    let obj = JSON.parse($response.body);
    let url = $request.url;

    if (obj && obj.data) {
        if (url.includes("searchRecommendByKeyword")) {
            if (Array.isArray(obj.data.dataList)) {
                obj.data.dataList = [];
            }
        } else if (url.includes("/spu/search")) {
            if (obj.data.trySearchKeywordResponse) {
                delete obj.data.trySearchKeywordResponse;
            }
        }
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
