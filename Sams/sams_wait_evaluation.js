try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        if (obj?.data) {
            // 将“待评价”的数量强制改为 0，App 识别到 0 就会自动隐藏红色数字角标
            if (obj.data.waitEvaluationNum !== undefined) {
                obj.data.waitEvaluationNum = 0;
            }
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆隐藏待评价角标脚本运行异常: " + error);
    // 静默放行
    $done({});
}
