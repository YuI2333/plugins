try {
    let url = $request.url;
    let body = JSON.parse($response.body);

    if (body?.data) {
        if (url.includes("searchRecommendByKeyword")) {
            // 拦截搜索推荐商品
            body.data.dataList = [];
            body.data.searchFilterList = [];
            body.data.cardFilterList = [];
            body.data.totalCount = 0;
            body.data.pageSize = 0;
            body.data.hasNextPage = false;
            body.data.isNextPage = false;
        } else {
            // 拦截搜索结果推荐词
            if (body.data.trySearchKeywordResponse) {
                delete body.data.trySearchKeywordResponse;
            }
        }
    }

    $done({ body: JSON.stringify(body) });
} catch (e) {
    console.log("Sams search filter error: " + e);
    $done({});
}
