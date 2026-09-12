if (!$response.body) $done({});

try {
    let obj = JSON.parse($response.body);
    if (Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => ![4, 5, 7].includes(item.currentType));
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
