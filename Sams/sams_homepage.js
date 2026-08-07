let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.pageModuleVOList) {
        // 采用白名单机制，增加 sliderModule 以保留轮播海报
        const allowList = [
            "storeTopModule",             // 顶部模块
            "sliderModule",               // 顶部轮播海报
            "imageTextNavigationModule",  // 分类导航 (金刚区)
            "tofuCubeModule",             // 豆腐块
            "blankModule"                 // 空白分隔符
        ];

        let tofuCount = 0;

        obj.data.pageModuleVOList = obj.data.pageModuleVOList.filter(module => {
            // 过滤不在白名单中的所有模块
            if (!allowList.includes(module.moduleSign)) {
                return false;
            }

            // 针对豆腐块模块，仅保留前 2 个
            if (module.moduleSign === "tofuCubeModule") {
                tofuCount++;
                if (tofuCount > 2) {
                    return false;
                }
            }

            return true;
        });

        // 遍历保留下来的模块进行定制化修改
        obj.data.pageModuleVOList.forEach(module => {
            // 1. 清理分类导航角标
            if (module.moduleSign === "imageTextNavigationModule" && module.renderContent && module.renderContent.originalItemList) {
                module.renderContent.originalItemList.forEach(item => {
                    delete item.atmosLogoText;
                    item.showAtmosphereLogo = false;
                    item.atmosLogoShow = "0";
                });
            }
            
            // 2. 修改轮播图：阻止自动轮播
            if (module.moduleSign === "sliderModule") {
                // 修改外层切换延迟时间为极大值
                if (module.bizStyle) {
                    module.bizStyle.transitionDelay = 99999;
                }
                // 修改内部每个图片的轮播间隔时间为极大值
                if (module.renderContent && module.renderContent.originalItemList) {
                    module.renderContent.originalItemList.forEach(item => {
                        item.boomInterval = 99999; 
                    });
                }
            }
        });
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
