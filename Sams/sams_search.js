try {
    let obj = JSON.parse($response.body);
    
    // 只要存在 data 节点，直接覆写为包含单个空格的数组
    if (obj.data) obj.data = [{ searchText: " ", searchTextEn: " " }];
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
