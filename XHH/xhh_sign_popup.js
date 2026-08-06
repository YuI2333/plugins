try {
    let obj = JSON.parse($response.body);
    
    // 直接删除触发弹窗提示的字段，避免UI渲染空白气泡
    delete obj.msg;
    
    if (obj.result) {
        delete obj.result.notify_description;
        delete obj.result.description;
        // 如果不需要在UI上看到具体的加成数值，也可直接删除
        delete obj.result.sign_in_coin;
        delete obj.result.sign_in_exp;
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    // 发生异常时直接放行原响应
    $done({});
}
