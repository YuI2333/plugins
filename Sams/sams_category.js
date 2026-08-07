let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.dataList) {
        
        // 递归清理所有分类层级的函数
        function cleanNode(node) {
            // 1. 无差别清除角标 (例如：得力文具、野生菌)
            if (node.iconMsg !== undefined) {
                delete node.iconMsg;
            }
            
            // 2. 匹配并去除标题中的 Emoji 字符 (例如：烧烤食材前面的火苗图标)
            if (node.title && typeof node.title === 'string') {
                // 匹配绝大部分代理对（Surrogate Pairs），覆盖常规的彩色 Emoji
                node.title = node.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim();
            }

            // 3. 递归遍历子节点 (自动适配左侧/右侧所有的二级、三级分类菜单)
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => cleanNode(child));
            }
        }

        // 遍历清理入口数据
        obj.data.dataList.forEach(item => cleanNode(item));
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
