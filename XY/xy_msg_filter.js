let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        if (obj && obj.data && Array.isArray(obj.data.sessions)) {
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
            body = JSON.stringify(obj);
        }
    } catch (e) {
        console.log("闲鱼消息过滤异常: " + e);
    }
}
$done({ body });
