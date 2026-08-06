let body = $response.body;
try {
    let obj = JSON.parse(body);
    // 修正 JSON 层级路径
    if (obj?.data?.hierarchy?.structure?.root) {
        let root = obj.data.hierarchy.structure.root;
        
        // 屏蔽警务资讯
        const blockList = [
            "mengn_3229"
        ];
        
        // 从渲染根节点中移除
        obj.data.hierarchy.structure.root = root.filter(item => !blockList.includes(item));
        
        // 同时清理 structure 中的子节点数据
        if (obj.data.hierarchy.structure["mengn_3229"]) {
            delete obj.data.hierarchy.structure["mengn_3229"];
        }
        
        body = JSON.stringify(obj);
    }
} catch (e) {
    console.log("脚本执行错误: " + e);
}
$done({ body });
