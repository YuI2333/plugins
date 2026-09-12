if ($response.body) {
    try {
        let obj = JSON.parse($response.body);
        if (obj && Array.isArray(obj.data)) {
            obj.data.forEach(item => {
                // 拦截 4(会籍账户), 5(山姆活动), 7(互动消息)
                if ([4, 5, 7].includes(item.currentType)) {
                    // 严格探测原数据类型，规避 typeMismatch 崩溃
                    // 注入安全空格 " " 维持底层 AutoLayout 布局不断层
                    if (typeof item.firstMessageTitle === 'string') {
                        item.firstMessageTitle = " ";
                    }
                    if (typeof item.text === 'string') {
                        item.text = " ";
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
        $done({});
    }
} else {
    $done({});
}
