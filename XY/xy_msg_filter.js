let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    if (obj.data) {
        // 1. 处理外层会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let sessionType = String(item?.session?.sessionType || "");
                let userId = String(item?.session?.userInfo?.userId || "");
                
                // 根据抓包，"闲鱼精选" 的 sessionType 固定为 25，userId 固定为 1500
                // 直接根据 ID 特征屏蔽纯广告会话，不看文本
                if (sessionType === "25" || userId === "1500") {
                    return false;
                }
                return true;
            });
        }

        // 2. 处理内层具体消息流 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let sessionType = String(item?.sessionInfo?.sessionType || "");
                let senderId = String(item?.senderInfo?.userId || "");
                
                // 屏蔽闲鱼精选的内部消息流
                if (sessionType === "25" || senderId === "1500") {
                    return false;
                }

                // 核心过滤：读取官方自带的底层消息分类标签
                if (item.extJson) {
                    try {
                        let ext = JSON.parse(item.extJson);
                        let multiChannel = ext.multiChannel || {};
                        
                        // 遍历所有通道标记，只要官方将其定性为 MARKETING (营销)，直接拦截
                        for (let key in multiChannel) {
                            let tag = String(multiChannel[key]).toUpperCase();
                            if (tag === "MARKETING") {
                                return false;
                            }
                        }
                    } catch (e) {
                        // JSON解析异常时放行
                    }
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
