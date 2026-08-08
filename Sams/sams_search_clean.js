let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    if (obj && obj.data) {
        // 1. 彻底删除“试试搜这些”相关的筛选和推荐词卡片，防止空数组仍触发前端UI
        delete obj.data.cardFilterList;
        delete obj.data.searchFilterList;
        
        // 2. 剥离“为您推荐”区块
        // 真实的搜索结果永远位于 dataList 的首位（索引 0）。
        // 强制截断数组，丢弃作为后续区块追加的所有推荐内容。
        if (Array.isArray(obj.data.dataList) && obj.data.dataList.length > 0) {
            obj.data.dataList = [obj.data.dataList[0]];
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆搜索净化脚本解析出错: " + e);
}

$done({ body });
