let body = $response.body;
try {
    let obj = JSON.parse(body);
    
    if (obj && obj.data) {
        // 清除“试试搜这些”等关联搜索词卡片
        if (obj.data.cardFilterList) {
            obj.data.cardFilterList = [];
        }
        if (obj.data.searchFilterList) {
            obj.data.searchFilterList = [];
        }
        
        // 过滤 dataList，仅保留 algId 为 "default" 的纯搜索结果，去除“为您推荐”等插入模块
        if (obj.data.dataList && Array.isArray(obj.data.dataList)) {
            obj.data.dataList = obj.data.dataList.filter(item => item.algId === "default");
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("山姆搜索净化脚本解析出错: " + e);
}

$done({ body });
