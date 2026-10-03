let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    const blackTargetIds = new Set(["1500"]);
    const blackSessionTypes = new Set(["25"]);
    const blackNicks = new Set(["闲鱼精选", "闲鱼情报局"]);
    
    const adKeywordsReg = /闲鱼币|红包|兑好礼|优推抵扣|曝光|捡漏|白菜价|能量|即将过期/i;
    const whiteKeywordsReg = /关注了您|发货|签收|拍下|退款/i;

    if (obj?.data) {
        // 1. 过滤外层会话列表
        if (Array.isArray(obj.data.sessions)) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                const session = item?.session;
                if (!session) return true;

                const summary = item?.message?.summary?.summary || "";
                
                // 白名单最高优先级
                if (whiteKeywordsReg.test(summary)) return true;

                // 缓存对象引用，减少原型链访问开销
                const uInfo = session.userInfo || {};
                const oInfo = session.ownerInfo || {};

                // 【性能优化】低成本属性比对前置：命中后直接剔除，跳过后续耗时的正则匹配
                if (blackSessionTypes.has(String(session.sessionType))) return false;
                if (blackTargetIds.has(String(session.targetId)) || 
                    blackTargetIds.has(String(uInfo.userId)) || 
                    blackTargetIds.has(String(oInfo.userId))) return false;
                if (blackNicks.has(uInfo.nick) || blackNicks.has(oInfo.nick)) return false;

                // 兜底正则匹配后置
                if (adKeywordsReg.test(summary)) return false;

                return true;
            });
        }

        // 2. 过滤内层具体消息
        if (Array.isArray(obj.data.messages)) {
            obj.data.messages = obj.data.messages.filter(item => {
                const sInfo = item?.sessionInfo || {};
                const uInfo = sInfo.userInfo || {};
                const sender = item?.senderInfo || {};

                // 【性能优化】低成本的直接比对前置
                if (blackSessionTypes.has(String(sInfo.sessionType))) return false;
                if (blackNicks.has(sender.nick) || blackNicks.has(uInfo.nick)) return false;

                // 【性能优化】彻底抛弃循环内的 JSON.parse()，直接使用字符串检索渠道标签
                // 原代码需在循环体中 parse 几十次极耗性能，现改为底层字符级匹配
                if (item.extJson && item.extJson.includes("MARKETING")) return false;

                // 【性能优化】将对象深度序列化 JSON.stringify 放至最后
                // 仅当上方低成本拦截均未命中时，才执行耗性能的序列化与长正则匹配
                if (item.content) {
                    const contentStr = JSON.stringify(item.content);
                    if (whiteKeywordsReg.test(contentStr)) return true;
                    if (contentStr.includes("xianyu_growth_push") || contentStr.includes("moyu-project")) return false;
                    if (adKeywordsReg.test(contentStr)) return false;
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
