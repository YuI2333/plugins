let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.sessions) {
        obj.data.sessions = obj.data.sessions.filter(item => {
            let summary = item?.message?.summary?.summary || "";
            if (summary.includes("100闲鱼币待领")) {
                return false;
            }
            return true;
        });
        body = JSON.stringify(obj);
    }
} catch (e) {
    console.log("闲鱼消息解析异常: " + e.message);
}
$done({body});
