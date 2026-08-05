// 获取响应体
let body = $response.body;

if (body) {
    let obj = JSON.parse(body);

    if (obj.data) {
        // 1. 将弹窗显示标志设为 0 (通常 1 为显示，0 为不显示)
        obj.data.popupDisplay = 0;
        
        // 2. 将更新类型设为 0 (通常 2 代表强制或建议更新，0 代表无更新)
        obj.data.type = 0;

        // 3. 处理内部的 generalUpdate 对象
        if (obj.data.generalUpdate) {
            obj.data.generalUpdate.popupDisplay = 0;
            obj.data.generalUpdate.updateType = 0;
            // 可选：将版本号改为一个极小的数字，让 App 认为不需要更新
            obj.data.generalUpdate.version = "1.0.0";
        }
    }

    // 重新封包
    body = JSON.stringify(obj);
}

$done({ body });
