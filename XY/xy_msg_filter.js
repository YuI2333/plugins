let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.sessions) {
        // 在这里添加你需要屏蔽的通知关键词
        const blockKeywords = ["100闲鱼币待领", "降价啦"];
        
        obj.data.sessions = obj.data.sessions.filter(item => {
            let summary = item?.message?.summary?.summary || "";
            // 如果消息摘要包含数组中的任意关键词，则拦截
            if (blockKeywords.some(keyword => summary.includes(keyword))) {
                return false;
            }
            return true;
        });
        body = JSON.stringify(obj);
    }
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}
$done({body});
