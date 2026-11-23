/*
 * 闲鱼消息极简净化脚本
 * 逻辑：外层仅放行真实用户私聊(sessionType:1)，内层拦截非私聊消息流及营销文案
 */

const body = $response.body;

if (!body) {
    $done({});
} else {
    try {
        const obj = JSON.parse(body);
        const api = obj?.api || "";
        const data = obj?.data;

        if (data) {
            // 1. 外层会话列表同步 (session.sync)
            if (api.includes("session.sync") && Array.isArray(data.sessions)) {
                const blockUserIds = new Set(["100", "200", "1500"]);
                const beforeCount = data.sessions.length;

                data.sessions = data.sessions.filter(item => {
                    const s = item?.session;
                    if (!s) return false;

                    const sType = String(s.sessionType ?? "");
                    const uType = String(s?.userInfo?.type ?? "");
                    const oType = String(s?.ownerInfo?.type ?? "");
                    const uId = String(s?.userInfo?.userId ?? "");
                    const oId = String(s?.ownerInfo?.userId ?? "");
                    const tId = String(s?.targetId ?? "");

                    // 仅保留真实私聊(sessionType为1，且双方均非系统账号type:10及系统ID)
                    return (
                        sType === "1" &&
                        uType !== "10" &&
                        oType !== "10" &&
                        !blockUserIds.has(uId) &&
                        !blockUserIds.has(oId) &&
                        !blockUserIds.has(tId)
                    );
                });

                console.log(
                    `[闲鱼消息净化] ${api} | 字节:${body.length} | 会话:${beforeCount} -> ${data.sessions.length}`
                );
            }

            // 2. 内层消息详情同步 (message.sync)
            else if (api.includes("message.sync")) {
                const adKeywords = /副业|闲鱼币|能量|优推抵扣|降价啦/;
                let beforeCount = 0;
                let afterCount = 0;

                for (const key of Object.keys(data)) {
                    if (Array.isArray(data[key])) {
                        beforeCount += data[key].length;
                        data[key] = data[key].filter(msg => {
                            const sType = String(msg?.sessionType ?? msg?.session?.sessionType ?? "");
                            if (sType && sType !== "1") return false;
                            return !adKeywords.test(JSON.stringify(msg));
                        });
                        afterCount += data[key].length;
                    }
                }

                console.log(
                    `[闲鱼消息净化] ${api} | 字节:${body.length} | 消息:${beforeCount} -> ${afterCount}`
                );
            }
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log(`[闲鱼消息净化] 异常 | 字节:${body.length} | ${e.message}`);
        $done({});
    }
}
