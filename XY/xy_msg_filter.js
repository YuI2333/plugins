let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 发送方黑名单：直接拦截这些账号的所有推送，一劳永逸
    const blacklistedNicks = ["闲鱼精选", "闲鱼情报局"];
    
    if (obj.data) {
        // 1. 处理会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let nick = item?.session?.userInfo?.nick || "";
                let summary = item?.message?.summary?.summary || "";
                
                // 拦截黑名单账号的会话
                if (blacklistedNicks.includes(nick)) {
                    return false;
                }
                
                // 针对“系统消息”账号：不建议全部拉黑，以免漏掉交易维权等重要通知
                // 仅针对性屏蔽闲鱼币等极其固定的系统提醒
                if (nick === "系统消息" && summary.includes("闲鱼币")) {
                    return false;
                }
                
                return true;
            });
        }

        // 2. 处理具体消息流 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let senderNick = item?.senderInfo?.nick || "";
                
                // 拦截黑名单账号下发的所有消息卡片
                if (blacklistedNicks.includes(senderNick)) {
                    return false;
                }
                
                // 备用方案：通过内容类型拦截（28通常为营销类动态卡片，若仍有漏网之鱼可取消下方注释）
                // let contentType = item?.content?.contentType;
                // if (contentType === "28") return false;
                
                return true;
            });
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}

$done({body});
