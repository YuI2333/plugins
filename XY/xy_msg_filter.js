let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        const api = String(obj.api || "");

        // 1. 外层消息列表接口 (session.sync)
        if (api.includes("session.sync") && obj.data && Array.isArray(obj.data.sessions)) {
            const blockTypes = ["3", "6", "25"];
            const blockUserIds = ["100", "200", "1500"];
            const blockNicks = ["系统消息", "通知消息", "闲鱼精选", "留言", "互动消息"];

            obj.data.sessions = obj.data.sessions.filter(item => {
                const s = item && item.session;
                if (!s) return true;

                const sType = String(s.sessionType || "");
                const uInfo = s.userInfo || {};
                const uType = String(uInfo.type || "");
                const uId = String(uInfo.userId || s.targetId || "");
                const uNick = String(uInfo.nick || "");

                if (
                    uType === "10" ||
                    blockTypes.includes(sType) ||
                    blockUserIds.includes(uId) ||
                    blockNicks.includes(uNick)
                ) {
                    return false;
                }
                return true;
            });
        }

        // 2. 内层通知消息/互动消息详情页接口及顶栏固定配置接口通杀
        if (obj.data && !api.includes("session.sync")) {
            // 如果存在顶栏固定入口配置数组（如 headers / topSessions / entranceList），直接清空
            ["headers", "topSessions", "entrances", "entranceList", "fixedSessions", "systemSessions"].forEach(key => {
                if (Array.isArray(obj.data[key])) {
                    obj.data[key] = [];
                }
            });

            // 如果是点进“通知消息”或“互动消息”触发的消息列表数组，检查是否含系统通知特征并清空
            ["messages", "list", "messageList", "items", "cardList"].forEach(key => {
                if (Array.isArray(obj.data[key])) {
                    const str = JSON.stringify(obj.data[key]);
                    if (
                        str.includes("副业") ||
                        str.includes("闲鱼币") ||
                        str.includes("能量") ||
                        str.includes("优推抵扣") ||
                        str.includes("\"sessionType\":\"3\"") ||
                        str.includes("\"sessionType\":\"6\"")
                    ) {
                        obj.data[key] = [];
                    }
                }
            });
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("闲鱼消息净化异常: " + e);
    }
}
$done({ body });
