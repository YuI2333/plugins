try {
    let obj = JSON.parse($response.body);
    let url = $request.url;

    if (url.includes("get_sign")) {
        // 赋值为空字符串更安全，防止前端解析报错
        obj.msg = ""; 
        if (obj.result) {
            // 将触发弹窗的布尔值强制拦截为 false
            obj.result.plus_hcoin = false;
            obj.result.plus_exp = false;
            // 清理其他显示字段
            ["notify_description", "description", "sign_in_coin", "sign_in_exp", "level_info"].forEach(k => delete obj.result[k]);
        }
    } else if (obj.result) {
        if (url.includes("search/found")) {
            delete obj.result.search_found;
        } else if (url.includes("welcome_page/v2")) {
            obj.result.default_q = "";
        } else if (url.includes("msg/center/list")) {
            // 过滤活动消息和游戏优惠
            if (obj.result.messages) {
                obj.result.messages = obj.result.messages.filter(i => {
                    let username = i?.user_a?.username || "";
                    return !["活动消息", "游戏优惠"].includes(username);
                });
                // 将剩余消息的未读状态置零
                obj.result.messages.forEach(m => {
                    m.count = 0;
                    m.enable_unread = 0;
                });
            }
            // 将顶部 Header 分类（如赞和收藏等）的未读状态置零
            if (obj.result.header) {
                obj.result.header.forEach(h => {
                    h.count = 0;
                    h.enable_unread = 0;
                });
            }
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
