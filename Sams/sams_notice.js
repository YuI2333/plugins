let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        if (obj && Array.isArray(obj.data)) {
            obj.data.forEach(item => {
                // 拦截 4(会籍账户), 5(山姆活动), 7(互动消息)
                if ([4, 5, 7].includes(item.currentType)) {
                    // 使用零宽字符绕过 iOS 客户端去空格检测及布局崩溃
                    const zwsp = "\u200B"; 
                    
                    if (typeof item.firstMessageTitle === 'string') {
                        item.firstMessageTitle = zwsp;
                    }
                    if (typeof item.text === 'string') {
                        item.text = zwsp;
                    }
                    if (typeof item.imageUrl === 'string') {
                        item.imageUrl = "";
                    }
                    item.unreadCount = "0";
                }
            });
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 解析异常时必须放行原数据，防止空响应导致无限加载
        $done({ body });
    }
} else {
    $done({});
}
