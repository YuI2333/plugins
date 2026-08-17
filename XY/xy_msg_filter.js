let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    // 纯广告账号黑名单，直接全量拦截
    const blackNicks = ["闲鱼精选", "闲鱼情报局"];
    
    // 兜底黑名单，主要用于处理外层列表及无底层标签的系统广告
    const adKeywords = ["闲鱼币", "红包", "兑好礼", "优推抵扣", "曝光", "捡漏", "白菜价"];
    
    // 白名单最高优先级，确保正常社交与交易不被误杀
    const whiteKeywords = ["关注了您", "发货", "签收", "拍下", "退款"];

    if (obj.data) {
        // 1. 过滤外层会话列表 (session.sync)
        if (obj.data.sessions) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                let nick = item?.session?.userInfo?.nick || "";
                let summary = item?.message?.summary?.summary || "";
                let sessionType = String(item?.session?.sessionType || "");

                // 优先放行白名单
                if (whiteKeywords.some(kw => summary.includes(kw))) return true;

                // 拦截已知营销账号 (sessionType 25 为闲鱼精选)
                if (sessionType === "25" || blackNicks.includes(nick)) return false;

                // 外层无标签，必须使用兜底关键词清理系统账号夹带的广告
                if (adKeywords.some(kw => summary.includes(kw))) return false;

                return true;
            });
        }

        // 2. 过滤内层具体消息 (message.sync)
        if (obj.data.messages) {
            obj.data.messages = obj.data.messages.filter(item => {
                let nick1 = item?.senderInfo?.nick || "";
                let nick2 = item?.sessionInfo?.userInfo?.nick || "";
                let sessionType = String(item?.sessionInfo?.sessionType || "");
                let contentStr = JSON.stringify(item?.content || {});

                // 优先放行白名单
                if (whiteKeywords.some(kw => contentStr.includes(kw))) return true;

                // 拦截已知营销账号
                if (sessionType === "25" || blackNicks.includes(nick1) || blackNicks.includes(nick2)) return false;

                // 核心过滤 1：提取官方底层渠道标签 (精准拦截，无视文案变化)
                if (item.extJson) {
                    try {
                        let ext = JSON.parse(item.extJson);
                        let multi = ext.multiChannel || {};
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
                if (adKeywords.some(kw => contentStr.includes(kw))) return false;

                return true;
            });
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}

$done({body});
