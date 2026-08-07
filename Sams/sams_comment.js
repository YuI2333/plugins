let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data) {
        obj.data = [];
    }
    $done({ body: JSON.stringify(obj) });
} catch(e) {
    $done({});
}
