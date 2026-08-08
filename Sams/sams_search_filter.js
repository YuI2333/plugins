if (typeof $response === "undefined" || !$response.body) {
    $done({});
} else {
    try {
        let body = JSON.parse($response.body);
        
        if (body?.data) {
            body.data.dataList = [];
            body.data.searchFilterList = [];
            body.data.cardFilterList = [];
            body.data.totalCount = 0;
            body.data.pageSize = 0;
            body.data.hasNextPage = false;
            body.data.isNextPage = false;
        }
        
        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
}
