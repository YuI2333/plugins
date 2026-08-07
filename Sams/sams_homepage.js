let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.pageModuleVOList) {
        // 采用白名单机制，仅保留目标模块，无需维护关键字
        const allowList = [
            "storeTopModule",             // 顶部模块
            "imageTextNavigationModule",  // 分类导航 (金刚区)
            "tofuCubeModule",             // 豆腐块
            "blankModule"                 // 空白分隔符
        ];

        let tofuCount = 0;

        obj.data.pageModuleVOList = obj.data.pageModuleVOList.filter(module => {
            // 过滤不在白名单中的所有模块（包含轮播图、黑板报、推荐瀑布流、图片广告等）
            if (!allowList.includes(module.moduleSign)) {
                return false;
            }

            // 针对豆腐块模块，仅保留前 2 个（正好对应截图中的 4 个核心推荐块）
            // 后续所有动态下发的广告豆腐块（如评价有礼、软骨肋排等）将被一并丢弃
            if (module.moduleSign === "tofuCubeModule") {
                tofuCount++;
                if (tofuCount > 2) {
                    return false;
                }
            }

            return true;
        });

        // 清理保留下来的分类导航角标
        obj.data.pageModuleVOList.forEach(module => {
            if (module.moduleSign === "imageTextNavigationModule" && module.renderContent && module.renderContent.originalItemList) {
                module.renderContent.originalItemList.forEach(item => {
                    delete item.atmosLogoText;
                    item.showAtmosphereLogo = false;
                    item.atmosLogoShow = "0";
                });
            }
        });
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
