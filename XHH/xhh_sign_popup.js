try {
    let obj = JSON.parse($response.body);
    let url = $request.url;

    if (url.includes("get_sign")) {
        delete obj.msg;
        if (obj.result) {
            ["notify_description", "description", "sign_in_coin", "sign_in_exp", "level_info"].forEach(k => delete obj.result[k]);
        }
    } else if (obj.result) {
        if (url.includes("popup")) {
            obj.result.popup_list = [];
        } else if (obj.result.messages) {
            // 通过排除法，进入此分支的必然是消息列表接口
            obj.result.messages = obj.result.messages.filter(i => !["活动消息", "游戏优惠"].includes(i?.user_a?.username));
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
