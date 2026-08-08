try {
    let obj = JSON.parse($response.body);
    
    if (obj && obj.data) {
        // 去除“为您推荐”商品列表
        if (Array.isArray(obj.data.dataList)) {
            obj.data.dataList = [];
        }
        // 去除“试试搜这些”推荐词
        if (Array.isArray(obj.data.searchFilterList)) {
            obj.data.searchFilterList = [];
        }
        if (Array.isArray(obj.data.cardFilterList)) {
            obj.data.cardFilterList = [];
        }
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
