/*
 * 闲鱼消息极简净化脚本
 * 逻辑：外层仅放行真实用户私聊(sessionType:1)，内层拦截非私聊消息流
 */

let body = $response.body;

if (body) {
    try {
        const obj = JSON.parse(body);
        const api = obj?.api || "";
        const data = obj?.data;

        if (data) {
            // 1. 外层会话列表同步 (session.sync)
            if (api.includes("session.sync") && Array.isArray(data.sessions)) {
                const blockTypes = new Set(["3", "6", "25"]);
                const blockUserIds = new Set(["100", "200", "1500"]);

                data.sessions = data.sessions.filter(item => {
                    const s = item?.session;
                    if (!s) return false;

                    const sType = String(s.sessionType ?? "");
                    const uType = String(s?.userInfo?.type ?? "");
                    const uId = String(s?.userInfo?.userId ?? s.targetId ?? "");

                    // 仅保留真实私聊(sessionType为1且非系统账号type:10)
                    return sType === "1" && uType !== "10" && !blockTypes.has(sType) && !blockUserIds.has(uId);
                });
            }

            // 2. 内层消息详情同步 (message.sync)
            else if (api.includes("message.sync")) {
                const adKeywords = /副业|闲鱼币|能量|优推抵扣|降价啦/;
                for (const key of Object.keys(data)) {
                    if (Array.isArray(data[key])) {
                        data[key] = data[key].filter(msg => {
                            const sType = String(msg?.sessionType ?? msg?.session?.sessionType ?? "");
                            if (sType && sType !== "1") return false;
                            return !adKeywords.test(JSON.stringify(msg));
                        });
                    }
                }
            }
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log(`[闲鱼消息净化] 异常: ${e.message}`);
    }
}

$done({ body });
