let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && Array.isArray(obj.data.categoryList)) {
        // 一刀切：直接清空分类列表，无视任何现有或未来新增的关键词
        obj.data.categoryList = [];
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
