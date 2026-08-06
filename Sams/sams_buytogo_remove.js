try {
    let body = JSON.parse($response.body);
    // 定位并删除省心带一件模块
    if (body && body.data && body.data.buyToGoInfo) {
        delete body.data.buyToGoInfo;
    }
    $done({ body: JSON.stringify(body) });
} catch (e) {
    console.log("山姆省心带一件脚本解析错误: " + e);
    $done({});
}
