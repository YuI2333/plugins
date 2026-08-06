try {
    let obj = JSON.parse($response.body);
    let url = $request.url;

    if (url.includes("get_sign")) {
        delete obj.msg;
        if (obj.result) {
            ["notify_description", "description", "sign_in_coin", "sign_in_exp", "level_info"].forEach(k => delete obj.result[k]);
        }
    } else if (obj.result) {
        if (url.includes("search/found")) {
            delete obj.result.search_found;
        } else if (obj.result.messages) {
            obj.result.messages = obj.result.messages.filter(i => !["活动消息", "游戏优惠"].includes(i?.user_a?.username));
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
