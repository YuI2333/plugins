let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.dataList) {
        
        function cleanNode(node) {
            // 仅无差别删除分类右上角的文字角标 (如：得力文具、野生菌)
            if (node.iconMsg !== undefined) {
                delete node.iconMsg;
            }
            
            
            // 递归清理所有子分类的角标
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => cleanNode(child));
            }
        }

        obj.data.dataList.forEach(item => cleanNode(item));
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
