/*
 * 闲鱼消息极简净化脚本
 * 逻辑：
 * 1. session.sync：移除推广会话(如闲鱼精选)，对常驻入口(通知消息/互动消息)强制清零未读并覆写版本号洗白，正常放行私聊(sessionType:1)
 * 2. message.sync：拦截非私聊消息流及营销文案
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
                const fixedSystemTypes = new Set(["3", "6"]); // 3: 通知/系统消息, 6: 互动/留言
                const blockUserIds = new Set(["100", "200", "1500"]);

                const beforeCount = data.sessions.length;
                let washedCount = 0;

                data.sessions = data.sessions.filter(item => {
                    const s = item?.session;
                    if (!s) return false;

                    const sType = String(s.sessionType ?? "");

                    // 常驻系统入口：保留壳子但强制洗白未读数与摘要，覆盖长连接写入的本地缓存
                    if (fixedSystemTypes.has(sType)) {
                        if (!item.message) item.message = {};
                        if (!item.message.summary) item.message.summary = {};

                        const sum = item.message.summary;
                        const oldVer = parseInt(sum.version, 10);

                        sum.unread = "0";
                        sum.summary = "还没有新通知~"; // 如需完全留空可改为 ""
                        if ("redReminder" in sum) sum.redReminder = "";
                        sum.version = String(Number.isNaN(oldVer) ? 99999 : oldVer + 10000);

                        washedCount++;
                        return true;
                    }

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
                    `[闲鱼消息净化] ${api} | 字节:${body.length} | 会话:${beforeCount} -> ${data.sessions.length} | 洗白:${washedCount}`
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
