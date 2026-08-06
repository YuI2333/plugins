try {
    let body = JSON.parse($response.body);
    if (body && body.data) {
        body.data.img = "";
        body.data.url = "";
        body.data.times = 0;
    }
    $done({ body: JSON.stringify(body) });
} catch (e) {
    $done({});
}
