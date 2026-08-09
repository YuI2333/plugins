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
            
            // 【修复关键】：山姆用透明的图片广告来做豆腐块缝隙，这里单独把“分隔符”图片放行
            if (module.moduleSign === "imageAdsModule") {
                let title = module.title || "";
                let assocName = module.moduleContent?.associationName || "";
                if (title.includes("分隔") || assocName.includes("分隔")) {
                    newList.push(module);
                }
                continue; // 真正的图片硬广依然会被拦截丢弃
            }

            // 非白名单模块直接拦截
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
                    // 过滤掉包含“商业化”或“广告”标识的第三方硬广（例如：POV5-商业化雀巢）
                    module.renderContent.originalItemList = module.renderContent.originalItemList.filter(item => {
                        let title = item.title || "";
                        let titleEn = item.titleEn || "";
                        return !(title.includes("商业化") || titleEn.includes("商业化") || title.includes("广告"));
                    });

                    // 阻止自动轮播
                    module.renderContent.originalItemList.forEach(item => {
                        item.boomInterval = 99999;
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
