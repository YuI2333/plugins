let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data) {
        if (Array.isArray(obj.data)) {
            obj.data = [];
        } else typeof obj.data === 'object' {
            for (let key in obj.data) {
                if (Array.isArray(obj.data[key])) {
                    obj.data[key] = [];
                }
            }
        }
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆广告组解析失败: " + e);
}
$done({ body });
