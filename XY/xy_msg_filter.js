let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 黑名单与关键词配置
    const blacklistedNicks = ["闲鱼精选", "闲鱼情报局"];
    const spamKeywords = ["闲鱼币", "红包", "兑好礼", "优推抵扣", "回血", "曝光"];
    
    // 白名单配置：包含以下关键词的消息将被绝对放行
    const whiteKeywords = ["关注了您"];
    
    if (obj.data) {
        // 1. 处理外层会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let nick = item?.session?.userInfo?.nick || "";
                let summary = item?.message?.summary?.summary || "";
                
                // 优先判断：命中白名单直接放行
                if (whiteKeywords.some(kw => summary.includes(kw))) {
                    return true;
                }
                
                // 拦截纯广告账号
                if (blacklistedNicks.includes(nick)) {
                    return false;
                }
                // 拦截垃圾关键词
                if (spamKeywords.some(kw => summary.includes(kw))) {
                    return false;
                }
                
                return true;
            });
        }

        // 2. 处理内层具体消息流 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let senderNick = item?.senderInfo?.nick || item?.sessionInfo?.userInfo?.nick || "";
                let contentStr = JSON.stringify(item?.content || {});
                
                // 优先判断：命中白名单直接放行
                if (whiteKeywords.some(kw => contentStr.includes(kw))) {
                    return true;
                }
                
                // 拦截纯广告账号
                if (blacklistedNicks.includes(senderNick)) {
                    return false;
                }
                // 拦截带有营销追踪代码的卡片
                if (contentStr.includes("xianyu_growth_push") || contentStr.includes("moyu-project")) {
                    return false;
                }
                // 拦截包含特殊营销词汇的卡片
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
