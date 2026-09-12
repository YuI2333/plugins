let body = $response.body;

if (!body) {
    $done({});
} else {
    try {
        let obj = JSON.parse(body);
        if (obj && Array.isArray(obj.data)) {
            // 过滤掉类型为 4(会籍账户), 5(山姆活动), 7(互动消息) 的数据
            obj.data = obj.data.filter(item => {
                return item && ![4, 5, 7].includes(item.currentType);
            });
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("山姆通知脚本解析异常: " + e);
        $done({});
    }
}
