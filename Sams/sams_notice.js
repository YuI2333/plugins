let body = $response.body;

if (!body) {
    $done({});
} else {
    try {
        let obj = JSON.parse(body);
        if (obj && Array.isArray(obj.data)) {
            // 遍历数组，保留数据节点但清空核心内容，避免客户端找不到对象而崩溃
            obj.data.forEach(item => {
                if ([4, 5, 7].includes(item.currentType)) {
                    item.text = null;
                    item.firstMessageTitle = null;
                    item.imageUrl = null;
                    item.unreadCount = "0";
                }
            });
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
