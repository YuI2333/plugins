let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    const blackTargetIds = new Set(["1500"]);
    const blackSessionTypes = new Set(["25"]);
    const blackNicks = new Set(["闲鱼精选", "闲鱼情报局"]);
    
    const adKeywordsReg = /闲鱼币|红包|兑好礼|优推抵扣|曝光|捡漏|白菜价|能量|即将过期|待领/i;
    const whiteKeywordsReg = /关注了您|发货|签收|拍下|退款/i;

    if (obj?.data) {
        // 1. 处理外层会话列表 (核心逻辑变更)
        if (Array.isArray(obj.data.sessions)) {
            // 使用 forEach 遍历修改，而不使用 filter 删除，用于覆盖APP本地TCP推送缓存
            obj.data.sessions.forEach(item => {
                const session = item?.session;
                if (!session) return;

                let summaryObj = item?.message?.summary;
                if (!summaryObj) return;
                
                const summary = summaryObj.summary || "";
                if (whiteKeywordsReg.test(summary)) return;

                const uInfo = session.userInfo || {};
                const oInfo = session.ownerInfo || {};

                let isAd = false;
                if (blackSessionTypes.has(String(session.sessionType))) isAd = true;
                if (!isAd && (blackTargetIds.has(String(session.targetId)) || 
                    blackTargetIds.has(String(uInfo.userId)) || 
                    blackTargetIds.has(String(oInfo.userId)))) isAd = true;
                if (!isAd && (blackNicks.has(uInfo.nick) || blackNicks.has(oInfo.nick))) isAd = true;
                if (!isAd && adKeywordsReg.test(summary)) isAd = true;

                // 命中广告特征后，覆写数据以消除红点缓存
                if (isAd) {
                    summaryObj.summary = "已自动清理"; // 替换外层干扰文案
                    summaryObj.unread = "0";      // 强制清零未读红点
                }
            });
        }

        // 2. 处理内层具体消息 (内层无外围缓存机制，继续使用 filter 直接剔除)
        if (Array.isArray(obj.data.messages)) {
            obj.data.messages = obj.data.messages.filter(item => {
                const sInfo = item?.sessionInfo || {};
                const uInfo = sInfo.userInfo || {};
                const sender = item?.senderInfo || {};

                if (blackSessionTypes.has(String(sInfo.sessionType))) return false;
                if (blackNicks.has(sender.nick) || blackNicks.has(uInfo.nick)) return false;
                if (item.extJson && item.extJson.includes("MARKETING")) return false;

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
