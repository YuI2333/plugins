let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.pageModuleVOList) {
        // 1. 过滤掉顶部轮播海报模块
        obj.data.pageModuleVOList = obj.data.pageModuleVOList.filter(
            module => module.moduleSign !== "sliderModule"
        );

        // 2. 遍历图文导航模块，去掉角标 (例如：得力文具、野生菌等)
        obj.data.pageModuleVOList.forEach(module => {
            if (module.moduleSign === "imageTextNavigationModule" && module.renderContent && module.renderContent.originalItemList) {
                module.renderContent.originalItemList.forEach(item => {
                    if (item.atmosLogoText) {
                        delete item.atmosLogoText;
                    }
                    if (item.showAtmosphereLogo !== undefined) {
                        item.showAtmosphereLogo = false;
                    }
                    if (item.atmosLogoShow !== undefined) {
                        item.atmosLogoShow = "0";
                    }
                });
            }
        });
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
