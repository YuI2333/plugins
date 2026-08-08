try {
    let obj = JSON.parse($response.body);
    // 定位并清空推荐列表数据
    if (obj && obj.data && obj.data.dataList) {
        obj.data.dataList = [];
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    // 发生异常时原样返回，避免应用网络请求卡死
    $done({});
}
