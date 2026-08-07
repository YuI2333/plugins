let body = $response.body;
try {
    let obj = JSON.parse(body);
    // 使用可选链检查数据结构
    if (Array.isArray(obj?.data?.pageModuleVOList)) {
        // 使用 Set 提高白名单匹配效率
        const allowList = new Set([
            "storeTopModule",             
            "sliderModule",               
            "imageTextNavigationModule",  
            "tofuCubeModule",             
            "blankModule"                 
        ]);

        let tofuCount = 0;
        let newList = [];

        // 单次循环完成过滤与修改
        for (let module of obj.data.pageModuleVOList) {
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
                module.renderContent?.originalItemList?.forEach(item => {
                    item.boomInterval = 99999;
                });
            }

            newList.push(module);
        }
        
        obj.data.pageModuleVOList = newList;
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
