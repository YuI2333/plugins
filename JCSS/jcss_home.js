let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj?.data?.data?.hierarchy?.structure?.root) {
        let root = obj.data.data.hierarchy.structure.root;
        
        // 仅屏蔽警务资讯模块
        const blockList = [
            "mengn_3229"
        ];
        
        obj.data.data.hierarchy.structure.root = root.filter(item => !blockList.includes(item));
        
        body = JSON.stringify(obj);
    }
} catch (e) {
    console.log("脚本执行错误: " + e);
}
$done({ body });
