let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 确保 data 节点存在且为对象
        if (obj && obj.data && typeof obj.data === 'object') {
            
            // 2. 严谨判断当前是否有商品列表
            let hasProducts = Array.isArray(obj.data.dataList) && obj.data.dataList.length > 0;
            
            // 3. 仅当穿插节点确实存在时才处理
            if (obj.data.trySearchKeywordResponse && typeof obj.data.trySearchKeywordResponse === 'object') {
                
                if (hasProducts) {
                    // 【场景 A：正常搜到商品】
                    // 直接摘除整个推荐词节点，防止 App 强插空数据导致越界崩溃。
                    delete obj.data.trySearchKeywordResponse;
                } else {
                    // 【场景 B：未搜到商品 / 敏感词拦截 / 缺省页】
                    // 必须保留外壳，防止 App 原生解析器因缺少字段报“网络错误”。
                    obj.data.trySearchKeywordResponse.dataList = [];
                    obj.data.trySearchKeywordResponse.totalCount = 0;
                    
                    // 防御性补全，保障必填字段不丢失
                    if (obj.data.trySearchKeywordResponse.pageSize === undefined) {
                        obj.data.trySearchKeywordResponse.pageSize = 6;
                    }
                    if (obj.data.trySearchKeywordResponse.pageNum === undefined) {
                        obj.data.trySearchKeywordResponse.pageNum = 1;
                    }
                }
            }
        }
        
        // 重新封包返回
        $done({ body: JSON.stringify(obj) });
    } catch (err) {
        // 解析异常兜底，放行原数据，确保不断网
        $done({ body });
    }
} else {
    $done({});
}
