if (typeof $response !== "undefined" && $response.body) {
    try {
        var body = $response.body;
        var obj = JSON.parse(body);
        var modified = false;

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
            var newBody = JSON.stringify(obj).replace(/[\u2028\u2029]/g, "");
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
