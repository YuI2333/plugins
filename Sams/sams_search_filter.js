/*
 * 山姆App搜索推荐/结果过滤脚本
 * 对应接口：/api/v1/sams/goods-portal/spu/searchRecommendByKeyword
 */

(() => {
    try {
        let body = $response.body;
        if (!body) {
            $done({});
            return;
        }

        let obj = JSON.parse(body);

        // 清空搜索结果商品列表，防止App崩溃或报网络错误
        if (obj && obj.data) {
            if (obj.data.dataList) {
                obj.data.dataList.forEach(item => {
                    if (item.spuItemsList) {
                        item.spuItemsList = [];
                    }
                });
            }
            if (obj.data.searchFilterList) {
                obj.data.searchFilterList = [];
            }
            if (obj.data.cardFilterList) {
                obj.data.cardFilterList = [];
            }
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 捕获异常，直接放行原响应，避免导致客户端报错
        $done({});
    }
})();
