let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj?.data) {
        // 优化1：全面清空关联词、筛选卡片、底部推荐等外层干扰字段
        ["cardFilterList", "searchFilterList", "relatedSearch", "recommendList", "bottomRecommend", "guessYouLike"].forEach(key => {
            if (obj.data.hasOwnProperty(key)) {
                obj.data[key] = [];
            }
        });

        // 优化2：严格重构 dataList 数组，直接拦截并丢弃所有算法推荐模块（保留纯商品列表的 default 模块）
        if (Array.isArray(obj.data.dataList)) {
            obj.data.dataList = obj.data.dataList.filter(item => item.algId === "default");
            
            // 优化3：深度遍历剩余的主搜索模块，剔除商品列表中可能混入的插桩推荐卡片和占位符
            obj.data.dataList.forEach(item => {
                if (Array.isArray(item.spuItemsList)) {
                    item.spuItemsList = item.spuItemsList.filter(spu => {
                        return (
                            !spu.isOnlyShowTagInfo &&     // 去除仅展示标签的非商品推荐卡片
                            spu.isRecommend !== true &&   // 去除内嵌的推荐标记
                            spu.isSimilar !== true &&     // 去除内嵌的相似标记
                            spu.hostItemId                // 确保必须是带有ID的真实商品
                        );
                    });
                }
            });
        }
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆净化优化版执行错误：" + e);
}
$done({ body });
