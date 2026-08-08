// 提前拦截无响应体的请求，防止 Loon 抛出底层变量缺失错误
if (typeof $response === "undefined" || !$response.body) {
    $done({});
} else {
    try {
        let obj = JSON.parse($response.body);
        
        if (obj?.data?.trySearchKeywordResponse) {
            delete obj.data.trySearchKeywordResponse;
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
