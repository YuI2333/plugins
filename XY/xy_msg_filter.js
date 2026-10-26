let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        const api = String(obj.api || "");

        if (obj.data) {
            // 1. 外层消息列表 (session.sync)：彻底剔除通知消息(3)、互动消息(6)、闲鱼精选(25)
            if (api.includes("session.sync") && Array.isArray(obj.data.sessions)) {
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

            // 2. 内层消息同步 (message.sync)：清空系统通知与推广消息详情
            if (api.includes("message.sync")) {
                Object.keys(obj.data).forEach(key => {
                    if (Array.isArray(obj.data[key])) {
                        obj.data[key] = obj.data[key].filter(msg => {
                            const str = JSON.stringify(msg);
                            if (
                                str.includes("\"8544987\"") ||
                                str.includes("\"3309667601\"") ||
                                str.includes("\"24035381102\"") ||
                                str.includes("\"sessionType\":\"3\"") ||
                                str.includes("\"sessionType\":\"6\"") ||
                                str.includes("\"sessionType\":\"25\"") ||
                                str.includes("副业") ||
                                str.includes("闲鱼币") ||
                                str.includes("能量") ||
                                str.includes("优推抵扣")
                            ) {
                                return false;
                            }
                            return true;
                        });
                    }
                });
            }
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("xy_msg_filter error: " + e);
    }
}
$done({ body });
