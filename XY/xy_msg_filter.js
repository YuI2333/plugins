let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 纯广告账号黑名单
    const blacklistedNicks = ["闲鱼精选", "闲鱼情报局"];
    
    // 兜底关键词：处理外层消息列表的摘要
    const spamKeywords = ["闲鱼币", "红包", "兑好礼", "优推抵扣", "回血", "曝光"];
    
    if (obj.data) {
        // 1. 处理外层会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let nick = item?.session?.userInfo?.nick || "";
                let summary = item?.message?.summary?.summary || "";
                
                if (blacklistedNicks.includes(nick)) return false;
                if (spamKeywords.some(kw => summary.includes(kw))) return false;
                
                return true;
            });
        }

        // 2. 处理内层具体消息流 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let senderNick = item?.senderInfo?.nick || item?.sessionInfo?.userInfo?.nick || "";
                let contentStr = JSON.stringify(item?.content || {});
                
                // 拦截纯广告账号下发的所有消息
                if (blacklistedNicks.includes(senderNick)) return false;
                
                // 核心过滤：拦截带有营销追踪代码的广告卡片（无视文案变化）
                // 抓包显示，广告统一带有 xianyu_growth_push 或 moyu-project 标识
                if (contentStr.includes("xianyu_growth_push") || contentStr.includes("moyu-project")) {
                    return false;
                }
                
                // 兜底过滤：拦截包含特殊营销词汇的卡片
                if (spamKeywords.some(kw => contentStr.includes(kw))) {
                    return false;
                }
                
                return true;
            });
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}

$done({body});
