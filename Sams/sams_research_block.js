try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        if (obj.data) {
            // 1. 清空问题列表和人群包，让它无内容可渲染
            if (obj.data.questionList) obj.data.questionList = [];
            if (obj.data.crowdList) obj.data.crowdList = [];
            
            // 2. 关闭各个页面的调研弹窗触发开关（防全屏黑罩）
            obj.data.cartSurveyPopupScreen = 0;
            obj.data.detailSurveyPopupScreen = 0;
            obj.data.searchSurveyPopupScreen = 0;
            obj.data.homeSurveyPopupScreen = 0;
            
            // 3. 【核心修复：彻底消灭浮动按钮】
            // 篡改活动时间为十几年前，让 App 自动判定活动已过期，从而销毁按钮
            obj.data.startTime = "2000-01-01T00:00:00.000+00:00"; 
            obj.data.endTime = "2000-01-01T00:00:00.000+00:00";
            
            // 破坏入口样式和场景配置
            obj.data.researchEntranceStyle = 0;
            obj.data.researchEntranceOneDay = 0;
            obj.data.researchScene = 0;
            
            // 清空所有的标题和 ID
            obj.data.foldTitle = "";
            obj.data.researchTitle = "";
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
