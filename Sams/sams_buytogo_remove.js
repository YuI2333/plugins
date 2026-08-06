try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        // 使用可选链 (?.) 安全判断并删除节点
        if (obj?.data?.buyToGoInfo) {
            delete obj.data.buyToGoInfo;
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆去除省心带一件脚本运行异常: " + error);
    $done({});
}
