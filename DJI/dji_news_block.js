let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 兼容数据直接在根目录，或者被包裹在 data 字段中的情况
        let target = obj.data ? obj.data : obj;

        // 仅对 dji_news 字段进行清空操作，保留其他通知正常运作
        if (target.dji_news) {
            target.dji_news.unread_quantity = 0;
            target.dji_news.last_notification = null;
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("DJI News JSON解析失败：" + e);
    }
}

$done({ body });
