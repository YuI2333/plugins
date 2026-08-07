let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.userCommentListItemList) {
        obj.data.userCommentListItemList = [];
        obj.data.totalNum = 0;
        obj.data.end = true;
    }
    $done({ body: JSON.stringify(obj) });
} catch(e) {
    $done({});
}
