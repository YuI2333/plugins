let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.pageModuleVOList) {
        // 采用白名单机制
        const allowList = [
            "storeTopModule",             // 顶部模块
            "sliderModule",               // 顶部轮播海报
            "imageTextNavigationModule",  // 分类导航 (金刚区)
            "tofuCubeModule",             // 豆腐块
            "blankModule"                 // 空白分隔符
        ];

        let tofuCount = 0;

        obj.data.pageModuleVOList = obj.data.pageModuleVOList.filter(module => {
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
            
            // 2. 修改轮播图：阻止自动轮播，保持原尺寸
            if (module.moduleSign === "sliderModule") {
                if (module.bizStyle) {
                    module.bizStyle.transitionDelay = 99999;
                }
                if (module.renderContent && module.renderContent.originalItemList) {
                    module.renderContent.originalItemList.forEach(item => {
                        item.boomInterval = 99999; 
                    });
                }
            }

            // 3. 去除豆腐块标题旁边的图片标签（上新日历、会员心选、大牌严选等）
            if (module.moduleSign === "tofuCubeModule" && module.renderContent && module.renderContent.tofuCubeData) {
                module.renderContent.tofuCubeData.forEach(tofu => {
                    // 彻底删除图片类型的标签对象
                    if (tofu.labelImg) delete tofu.labelImg;
                    if (tofu.labelImgEn) delete tofu.labelImgEn;
                    // 清空纯文本类型的标签内容
                    if (tofu.label !== undefined) tofu.label = "";
                    if (tofu.labelEn !== undefined) tofu.labelEn = "";
                });
            }
        });
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
