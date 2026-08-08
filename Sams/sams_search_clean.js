if (typeof $response !== "undefined" && $response.body) {
    try {
        let obj = JSON.parse($response.body);
        
        if (obj?.data?.trySearchKeywordResponse) {
            // 不使用 delete 彻底删除节点，赋值为 null 或保留空层级
            // 防止强类型语言解析数据模型时由于缺失字段而报错
            obj.data.trySearchKeywordResponse = null; 
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
