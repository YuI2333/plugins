let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.dataList) {
        
        function cleanNode(node) {
            // 1. 无差别清除角标 (如：得力文具、野生菌)
            if (node.iconMsg !== undefined) {
                delete node.iconMsg;
            }
            
            // 2. 清除可能由服务端直接下发的图标链接字段
            if (node.icon) delete node.icon;
            if (node.iconUrl) delete node.iconUrl;
            
            // 3. 强力正则：清除标题开头的所有【非中文、非字母、非数字】字符
            // 此逻辑可以精准打击 🔥 等所有 Emoji 符号及特殊占位符，且不受 Unicode 编码更新影响
            if (node.title && typeof node.title === 'string') {
                node.title = node.title.replace(/^[^\u4e00-\u9fa5a-zA-Z0-9]+/, '').trim();
            }

            // 4. 递归遍历所有子分类
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
