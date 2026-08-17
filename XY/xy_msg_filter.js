let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 账号黑名单：直接彻底屏蔽该账号的所有下发内容
    const blacklistedNicks = ["闲鱼精选", "闲鱼情报局"];
    
    // 垃圾消息特征词：用于精确剔除“系统消息”中夹杂的官方广告
    const spamKeywords = ["闲鱼币", "优推抵扣", "千万曝光", "红包助力"];
    
    if (obj.data) {
        // 1. 过滤外部会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let nick = item?.session?.userInfo?.nick || "";
                let summary = item?.message?.summary?.summary || "";
                
                // 拦截纯营销账号
                if (blacklistedNicks.includes(nick)) {
                    return false;
                }
                
                // 拦截系统账号夹带的广告摘要
                if (spamKeywords.some(kw => summary.includes(kw))) {
                    return false;
                }
                
                return true;
            });
        }

        // 2. 过滤内部消息流 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let senderNick = item?.senderInfo?.nick || "";
                let contentStr = JSON.stringify(item?.content || {});
                
                // 拦截纯营销账号下发的消息体
                if (blacklistedNicks.includes(senderNick)) {
                    return false;
                }
                
                // 拦截系统账号下发的具体广告卡片
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
