let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        if (obj.data && obj.data.trySearchKeywordResponse) {
            // 判断当前搜索结果中是否搜到了实际商品
            let hasProducts = Array.isArray(obj.data.dataList) && obj.data.dataList.length > 0;
            
            if (hasProducts) {
                // 场景 1：搜到了商品。
                // 必须直接删掉整个穿插节点，防止 App 强行获取空数组导致列表崩溃。
                delete obj.data.trySearchKeywordResponse;
            } else {
                // 场景 2：没搜到商品（如输入乱码）。
                // 必须保留节点结构，顺应原生的空状态，防止 App 解析不到字段而报错。
                obj.data.trySearchKeywordResponse.dataList = [];
                obj.data.trySearchKeywordResponse.totalCount = 0;
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (err) {
        $done({ body });
    }
} else {
    $done({});
}
