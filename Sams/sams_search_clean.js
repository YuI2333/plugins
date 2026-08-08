let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 确保 data 节点存在且为对象，防止服务端下发异常数据导致 JS 报错
        if (obj && obj.data && typeof obj.data === 'object') {
            
            // 2. 严谨判断当前是否有商品列表（防 null、防非数组）
            let hasProducts = Array.isArray(obj.data.dataList) && obj.data.dataList.length > 0;
            
            // 3. 仅当 trySearchKeywordResponse 节点确实存在时才处理
            if (obj.data.trySearchKeywordResponse && typeof obj.data.trySearchKeywordResponse === 'object') {
                
                if (hasProducts) {
                    // 【场景 1：搜索到商品】（对应你发的第一个包）
                    // 只要有商品，App 就默认会强行去读关键词列表并穿插。
                    // 此时变为 [] 会导致越界崩溃，因此最安全的做法是直接摘除整个节点。
                    delete obj.data.trySearchKeywordResponse;
                } else {
                    // 【场景 2 & 3：未搜索到商品】（对应你发的第二、第三个包）
                    // 此时属于原生空状态，由于底层解析器的强制性，必须保留节点，否则报网络错误。
                    // 我们保留它的“空壳”，确保不会因为缺失必填项而崩溃。
                    obj.data.trySearchKeywordResponse.dataList = [];
                    obj.data.trySearchKeywordResponse.totalCount = 0;
                    
                    // 防御性补全（防止服务端甚至连这俩基础字段都没下发）
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
        // 如果 JSON 解析出现任何异常，直接放行原数据，确保不断网
        $done({ body });
    }
} else {
    $done({});
}
