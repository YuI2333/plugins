if (typeof $response !== "undefined" && $response.body) {
    try {
        let body = JSON.parse($response.body);
        
        if (body?.data) {
            // 仅对确定存在的数组进行清空，严格保证外层节点不丢失
            if (Array.isArray(body.data.dataList)) {
                body.data.dataList = [];
            }
            if (Array.isArray(body.data.searchFilterList)) {
                body.data.searchFilterList = [];
            }
            if (Array.isArray(body.data.cardFilterList)) {
                body.data.cardFilterList = [];
            }
            
            if (body.data.hasOwnProperty('totalCount')) body.data.totalCount = 0;
            if (body.data.hasOwnProperty('pageSize')) body.data.pageSize = 0;
            if (body.data.hasOwnProperty('hasNextPage')) body.data.hasNextPage = false;
            if (body.data.hasOwnProperty('isNextPage')) body.data.isNextPage = false;
        }
        
        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
