let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        if (Array.isArray(obj.data)) {
            // 过滤：互动消息(7)、山姆活动(5)、会籍账户(4)
            const blockTypes = [4, 5, 7];
            obj.data = obj.data.filter(item => !blockTypes.includes(item.currentType));
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
