let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 清空弹窗提示文本
        if (obj.msg) {
            obj.msg = ""; 
        }
        
        // 抹除展示用的奖励参数（仅影响本地UI展示，不影响实际账号入账）
        if (obj.result) {
            obj.result.sign_in_coin = 0;
            obj.result.sign_in_exp = 0;
            obj.result.description = "";
            obj.result.notify_description = "";
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 解析失败则原样返回
        $done({ body });
    }
} else {
    $done({});
}
