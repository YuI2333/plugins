let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data && obj.data.totalGoodsNum) {
        // 将购物车数量修改为 0 以隐藏角标
        obj.data.totalGoodsNum = 0;
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆购物车数量脚本解析失败: " + e);
}
$done({ body });
