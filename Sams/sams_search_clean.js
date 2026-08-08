if (typeof $response === "undefined" || !$response.body) {
    $done({});
} else {
    try {
        let obj = JSON.parse($response.body);
        let url = $request.url;

        if (obj && obj.data) {
            // 处理“为您推荐”
            if (url.includes("searchRecommendByKeyword")) {
                if (obj.data.dataList && Array.isArray(obj.data.dataList)) {
                    obj.data.dataList = [];
                }
            } 
            // 处理“试试搜这些”
            else if (url.includes("/spu/search")) {
                if (obj.data.trySearchKeywordResponse && Array.isArray(obj.data.trySearchKeywordResponse.dataList)) {
                    obj.data.trySearchKeywordResponse.dataList = [];
                }
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
