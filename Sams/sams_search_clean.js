let body = $response.body;

if (typeof body !== "undefined" && body !== null) {
    try {
        let obj = JSON.parse(body);
        let modified = false;

        // 弃用 ?. 语法，改用传统 && 链式判断，彻底解决 Line:0 编译报错
        if (
            obj.data &&
            obj.data.trySearchKeywordResponse &&
            obj.data.trySearchKeywordResponse.dataList &&
            obj.data.trySearchKeywordResponse.dataList.length > 0
        ) {
            obj.data.trySearchKeywordResponse.dataList = [];
            obj.data.trySearchKeywordResponse.totalCount = 0;
            modified = true;
        }
        
        if (modified) {
            // 使用安全的正则写法过滤不可见段落分隔符，防止原生环境解析崩溃
            let newBody = JSON.stringify(obj).replace(/[\u2028\u2029]/g, "");
            $done({ body: newBody });
        } else {
            $done({});
        }
    } catch (err) {
        $done({});
    }
} else {
    $done({});
}
