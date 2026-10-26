/*
 * 闲鱼消息净化 (外层列表移除 + 内层详情清空)
 * 匹配接口：mtop.taobao.idlemessage.(session|message).sync
 */

let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        const api = String(obj.api || "");

        if (obj.data) {
            // 1. 处理外层消息页列表 (mtop.taobao.idlemessage.session.sync)
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

                    // 只要命中官方消息特征，整条直接从列表剔除，不留空壳
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

            // 2. 处理内层详情页消息同步 (mtop.taobao.idlemessage.message.sync)
            if (api.includes("message.sync")) {
                // 遍历 data 下所有数组字段（如 messages / sessionMessages / list），过滤或清空系统通知与互动消息
                Object.keys(obj.data).forEach(key => {
                    if (Array.isArray(obj.data[key])) {
                        obj.data[key] = obj.data[key].filter(msg => {
                            const str = JSON.stringify(msg);
                            // 剔除归属于通知消息(sessionType:3 / id:8544987)、互动消息(sessionType:6 / id:3309667601)、闲鱼精选(25)的内层消息卡片
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
