let body = $response.body;

if (typeof body === "undefined" || !body) {
    $done({});
} else {
    try {
        let obj = JSON.parse(body);
        let url = $request.url;

        if (obj && obj.data) {
            // 处理“为您推荐”
            if (url.includes("searchRecommendByKeyword")) {
                if (Array.isArray(obj.data.dataList)) {
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
        // 核心修复：发生解析异常时，必须原样返回原始数据，防止 App 卡死
        $done({ body: body });
    }
}
