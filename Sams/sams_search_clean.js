let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        let modified = false;

        // 使用可选链 (?.) 安全判断，避免因缺少某一层级导致 undefined 报错
        if (obj?.data?.trySearchKeywordResponse?.dataList?.length > 0) {
            
            // 优化点1：不使用 delete 删除对象，防止 App 原生解析抛出空指针异常
            // 改为清空推荐词数组和总数，完美维持原有的 JSON 树结构
            obj.data.trySearchKeywordResponse.dataList = [];
            obj.data.trySearchKeywordResponse.totalCount = 0;
            modified = true;
        }
        
        if (modified) {
            // 优化点2：修复 iOS JavaScriptCore 经典缺陷
            // 强制转义行分隔符和段落分隔符，彻底杜绝 __LOONRequestBody__ 异常
            let newBody = JSON.stringify(obj)
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029');
                
            $done({ body: newBody });
        } else {
            // 数据未修改，原样放行
            $done({});
        }
    } catch (err) {
        // 捕获异常，原样放行保底
        $done({});
    }
} else {
    $done({});
}
