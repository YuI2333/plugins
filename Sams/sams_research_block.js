try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        // 直接将整个 data 对象置为 null
        // 这样不仅保留了最外层的 success: true 防止报错，还能让 App 认为当前没有任何问卷，从而彻底折叠隐藏入口
        if (obj.data) {
            obj.data = null;
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆屏蔽调研问卷脚本运行异常: " + error);
    // 静默放行
    $done({});
}
