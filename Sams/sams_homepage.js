let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (Array.isArray(obj?.data?.pageModuleVOList)) {
        const allowList = new Set([
            "storeTopModule",             
            "sliderModule",               
            "imageTextNavigationModule",  
            "tofuCubeModule",             
            "blankModule"                 
        ]);

        let tofuCount = 0;
        let newList = [];

        for (let module of obj.data.pageModuleVOList) {
            
            if (module.moduleSign === "imageAdsModule") {
                let title = module.title || "";
                let assocName = module.moduleContent?.associationName || "";
                let advName = module.pageModuleAdvertiserName || "";

                // 1. 放行透明的图片“分隔符”
                if (title.includes("分隔") || assocName.includes("分隔")) {
                    newList.push(module);
                    continue;
                }

                // 2. 识别并放行顶部动态横幅（包含 顶通/横幅/gif 等标识）
                if (title.includes("顶通") || title.includes("横幅") || advName.includes("顶通") || title.toLowerCase().includes("gif")) {
                    if (module.renderContent?.originalItemList) {
                        // 过滤横幅内的第三方商业硬广
                        module.renderContent.originalItemList = module.renderContent.originalItemList.filter(item => {
                            let itemTitle = item.title || "";
                            let itemTitleEn = item.titleEn || "";
                            return !(itemTitle.includes("商业化") || itemTitleEn.includes("商业化") || itemTitle.includes("广告"));
                        });

                        // 阻止可能存在的自动轮播
                        module.renderContent.originalItemList.forEach(item => {
                            if (item.boomInterval) item.boomInterval = 99999;
                        });
                    }

                    // 过滤后若仍有内部活动内容，则放行该横幅
                    if (module.renderContent?.originalItemList?.length > 0) {
                        newList.push(module);
                    }
                    continue; 
                }

                // 其他真正的图片硬广依然会被拦截丢弃
                continue; 
            }

            // 非白名单模块直接拦截（瀑布流推荐商品等亦会被拦截）
            if (!allowList.has(module.moduleSign)) continue;

            if (module.moduleSign === "tofuCubeModule") {
                tofuCount++;
                if (tofuCount > 2) continue;
                
                module.renderContent?.tofuCubeData?.forEach(tofu => {
                    delete tofu.labelImg;
                    delete tofu.labelImgEn;
                    tofu.label = "";
                    tofu.labelEn = "";
                });
            }

            if (module.moduleSign === "imageTextNavigationModule") {
                module.renderContent?.originalItemList?.forEach(item => {
                    delete item.atmosLogoText;
                    item.showAtmosphereLogo = false;
                    item.atmosLogoShow = "0";
                });
            }

            if (module.moduleSign === "sliderModule") {
                if (module.bizStyle) module.bizStyle.transitionDelay = 99999;
                
                if (module.renderContent?.originalItemList) {
                    // 过滤掉包含“商业化”或“广告”标识的第三方硬广
                    module.renderContent.originalItemList = module.renderContent.originalItemList.filter(item => {
                        let title = item.title || "";
                        let titleEn = item.titleEn || "";
                        return !(title.includes("商业化") || titleEn.includes("商业化") || title.includes("广告"));
                    });

                    // 阻止自动轮播
                    module.renderContent.originalItemList.forEach(item => {
                        if (item.boomInterval) item.boomInterval = 99999;
                    });
                }
            }

            newList.push(module);
        }
        
        obj.data.pageModuleVOList = newList;
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
