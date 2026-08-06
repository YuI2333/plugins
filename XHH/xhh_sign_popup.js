try {
    let obj = JSON.parse($response.body);

    if ($request.url.includes("get_sign_state")) {
        delete obj.msg;
        if (obj.result) {
            ["notify_description", "description", "sign_in_coin", "sign_in_exp", "level_info"].forEach(k => delete obj.result[k]);
        }
    } else if (obj.result) {
        // 如果不是签到接口，必然是弹窗接口，直接清空列表
        obj.result.popup_list = [];
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
