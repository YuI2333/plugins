let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.dataList) {
        obj.data.dataList.forEach(item => {
            // 去除分类按钮角标，无视具体关键词
            if (item.hasOwnProperty('iconMsg')) {
                delete item.iconMsg;
            }
            
            // 覆盖默认展开状态
            item.isOpen = false;
            item.isExpand = false;
            item.spread = false;
            item.unfold = false;
        });
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
