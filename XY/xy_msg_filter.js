let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    const blackTargetIds = new Set(["1500"]);
    const blackSessionTypes = new Set(["25"]);
    const blackNicks = new Set(["闲鱼精选", "闲鱼情报局"]);
    
    const adKeywordsReg = /闲鱼币|红包|兑好礼|优推抵扣|曝光|捡漏|白菜价|能量|即将过期|待领/i;
    const whiteKeywordsReg = /关注了您|发货|签收|拍下|退款/i;

    if (obj?.data) {
        // 1. 处理外层会话列表
        if (Array.isArray(obj.data.sessions)) {
            obj.data.sessions = obj.data.sessions.filter(item => {
                const session = item?.session;
                if (!session) return true;

                let summaryObj = item?.message?.summary;
                if (!summaryObj) return true;
                
                const summary = summaryObj.summary || "";
                const uInfo = session.userInfo || {};
                const oInfo = session.ownerInfo || {};

                // 提前声明并转换变量，减少重复执行 String() 方法带来的性能损耗
                const sType = String(session.sessionType || "");
                const tId = String(session.targetId || "");
                const uId = String(uInfo.userId || "");
                const oId = String(oInfo.userId || "");

                if (blackSessionTypes.has(sType)) return false;
                if (blackTargetIds.has(tId) || blackTargetIds.has(uId) || blackTargetIds.has(oId)) return false;
                if (blackNicks.has(uInfo.nick) || blackNicks.has(oInfo.nick)) return false;

                if (sType === "6" && summary === "[和TA聊一聊吧]") {
                    summaryObj.summary = "无";
                    return true;
                }

                if (whiteKeywordsReg.test(summary)) return true;

                if (adKeywordsReg.test(summary)) {
                    summaryObj.summary = "无"; 
                    summaryObj.unread = "0";      
                    return true;
                }

                return true;
            });
        }

        // 2. 处理内层具体消息
        if (Array.isArray(obj.data.messages)) {
            obj.data.messages = obj.data.messages.filter(item => {
                const sInfo = item?.sessionInfo || {};
                const uInfo = sInfo.userInfo || {};
                const sender = item?.senderInfo || {};
                const sType = String(sInfo.sessionType || "");

                if (blackSessionTypes.has(sType)) return false;
                if (blackNicks.has(sender.nick) || blackNicks.has(uInfo.nick)) return false;
                if (item.extJson && item.extJson.includes("MARKETING")) return false;

                if (item.content) {
                    // 判断对象类型，避免对已经是字符串的 content 执行 JSON.stringify 增加额外开销
                    const contentStr = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);
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
