try {
    if ($response && $response.body) {
        let obj = JSON.parse($response.body);
        
        // 确保数据结构存在
        if (obj?.data?.pageModuleVOList && Array.isArray(obj.data.pageModuleVOList)) {
            // 遍历所有页面模块
            obj.data.pageModuleVOList.forEach(module => {
                // 定位到包含导航元素的列表 (通常是 imageTextNavigationModule)
                if (module?.renderContent?.originalItemList && Array.isArray(module.renderContent.originalItemList)) {
                    module.renderContent.originalItemList.forEach(item => {
                        // 强制关闭角标显示，并清空所有可能存在的角标文字
                        if (item.showAtmosphereLogo !== undefined) {
                            item.showAtmosphereLogo = false; 
                        }
                        if (item.atmosLogoShow !== undefined) {
                            item.atmosLogoShow = "0"; 
                        }
                        if (item.atmosLogoText !== undefined) {
                            item.atmosLogoText = ""; 
                        }
                        if (item.atmosLogoTextEn !== undefined) {
                            item.atmosLogoTextEn = ""; 
                        }
                    });
                }
            });
        }
        
        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (error) {
    console.log("山姆去除分类角标脚本运行异常: " + error);
    // 发生异常时静默放行，避免 App 白屏或报网络错误
    $done({});
}
