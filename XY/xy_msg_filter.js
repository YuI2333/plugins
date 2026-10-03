let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 核心黑名单标识：使用 Set 提升检索效率
    const blackTargetIds = new Set(["1500"]); // 1500 为闲鱼精选固定ID
    const blackSessionTypes = new Set(["25"]); // 25 为推广会话类型
    const blackNicks = new Set(["闲鱼精选", "闲鱼情报局"]);
    
    // 使用正则提升关键词匹配效率，新增"能量"、"即将过期"拦截系统消息中的营销推送
    const adKeywordsReg = /闲鱼币|红包|兑好礼|优推抵扣|曝光|捡漏|白菜价|能量|即将过期/i;
    const whiteKeywordsReg = /关注了您|发货|签收|拍下|退款/i;

    if (obj?.data) {
        // 1. 过滤外层会话列表 (session.sync)
        if (Array.isArray(obj.data.sessions)) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                const session = item?.session;
                if (!session) return true;

                const summary = item?.message?.summary?.summary || "";
                
                // 优先放行白名单
                if (whiteKeywordsReg.test(summary)) return true;

                const sessionType = String(session.sessionType || "");
                const targetId = String(session.targetId || "");
                
                // 提取双边信息
                const userInfoNick = session.userInfo?.nick || "";
                const ownerInfoNick = session.ownerInfo?.nick || "";
                const userInfoId = String(session.userInfo?.userId || "");
                const ownerInfoId = String(session.ownerInfo?.userId || "");

                // 拦截已知营销账号与固定官方 ID
                if (blackSessionTypes.has(sessionType)) return false;
                if (blackTargetIds.has(targetId) || blackTargetIds.has(userInfoId) || blackTargetIds.has(ownerInfoId)) return false;
                if (blackNicks.has(userInfoNick) || blackNicks.has(ownerInfoNick)) return false;

                // 兜底关键词过滤
                if (adKeywordsReg.test(summary)) return false;

                return true;
            });
        }

        // 2. 过滤内层具体消息 (message.sync)
        if (Array.isArray(obj.data.messages)) {
            obj.data.messages = obj.data.messages.filter(item => {
                const contentStr = JSON.stringify(item?.content || {});
                
                // 优先放行白名单
                if (whiteKeywordsReg.test(contentStr)) return true;

                const sessionType = String(item?.sessionInfo?.sessionType || "");
                const nick1 = item?.senderInfo?.nick || "";
                const nick2 = item?.sessionInfo?.userInfo?.nick || "";

                // 拦截已知营销账号
                if (blackSessionTypes.has(sessionType)) return false;
                if (blackNicks.has(nick1) || blackNicks.has(nick2)) return false;

                // 核心过滤 1：提取官方底层渠道标签
                if (item.extJson) {
                    try {
                        const ext = JSON.parse(item.extJson);
                        const multi = ext.multiChannel || {};
                        for (let key in multi) {
                            if (String(multi[key]).toUpperCase() === "MARKETING") {
                                return false;
                            }
                        }
                    } catch (e) {}
                }

                // 核心过滤 2：拦截通用营销追踪代码
                if (contentStr.includes("xianyu_growth_push") || contentStr.includes("moyu-project")) return false;

                // 兜底过滤：应对无标签的系统级别广告
                if (adKeywordsReg.test(contentStr)) return false;

                return true;
            });
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}

$done({body});
