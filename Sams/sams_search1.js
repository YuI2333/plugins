let headers = $request.headers;
let newHeaders = {};

for (let key in headers) {
    if (key.toLowerCase() === 'accept-encoding') {
        newHeaders[key] = 'gzip, deflate'; // 剔除 br 压缩格式
    } else {
        newHeaders[key] = headers[key];
    }
}

$done({ headers: newHeaders });
