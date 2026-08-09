try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        // 不再暴力置空 data，而是保留结构，掏空内容并关闭开关
        if (obj.data) {
            // 1. 清空问题列表和人群包，让它无内容可渲染
            if (obj.data.questionList) obj.data.questionList = [];
            if (obj.data.crowdList) obj.data.crowdList = [];
            
            // 2. 核心修复：关闭各个页面的调研弹窗触发开关（原数据是 3，我们改成 0）
            obj.data.cartSurveyPopupScreen = 0;     // 关闭购物车弹窗
            obj.data.detailSurveyPopupScreen = 0;   // 关闭详情页弹窗
            obj.data.searchSurveyPopupScreen = 0;   // 关闭搜索页弹窗
            obj.data.homeSurveyPopupScreen = 0;     // 关闭首页弹窗
            
            // 3. 移除调研 ID
            obj.data.researchId = "";
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆屏蔽调研问卷脚本运行异常: " + error);
    $done({});
}
