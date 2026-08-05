let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data) {
        if (Array.isArray(obj.data)) {
            obj.data = [];
        } else if (typeof obj.data === 'object') {
            for (let key in obj.data) {
                if (Array.isArray(obj.data[key])) {
                    obj.data[key] = [];
                } else if (typeof obj.data[key] === 'object' && obj.data[key] !== null) {
                    for (let subKey in obj.data[key]) {
                        if (Array.isArray(obj.data[key][subKey])) {
                            obj.data[key][subKey] = [];
                        }
                    }
                }
            }
        }
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆广告组解析失败: " + e);
}
$done({ body });
