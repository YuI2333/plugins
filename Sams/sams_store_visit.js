let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && Array.isArray(obj.data.categoryList)) {
        // 定义需要屏蔽的分类按钮名称黑名单
        const blockList = ["门店商品", "夏日好物"];
        
        // 过滤掉黑名单中的分类
        obj.data.categoryList = obj.data.categoryList.filter(
            item => !blockList.includes(item.title)
        );
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
