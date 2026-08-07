let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.dataList) {
        
        function cleanNode(node) {
            // 1. 无差别删除所有可能的独立图标字段
            const badKeys = ['iconMsg', 'icon', 'iconUrl', 'leftIcon', 'menuIcon', 'tag', 'tagUrl'];
            badKeys.forEach(k => {
                if (node[k] !== undefined) delete node[k];
            });
            
            // 2. 终极正则：只保留中文、字母、数字、斜杠(/)、横杠(-)、空格、和号(&)与括号
            // 其他所有花里胡哨的字符（包含一切已知和未知的 Emoji）统统抹除
            if (node.title && typeof node.title === 'string') {
                node.title = node.title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\/\-\(\)\s&]/g, '').trim();
            }

            // 3. 递归清理子节点
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
