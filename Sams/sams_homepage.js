let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj.data && obj.data.pageModuleVOList) {
        // 定义需要屏蔽的模块黑名单：顶部轮播海报、山姆黑板报
        const blockList = ["sliderModule", "newsExpressModule"];

        // 1. 过滤掉黑名单中的模块
        obj.data.pageModuleVOList = obj.data.pageModuleVOList.filter(
            module => !blockList.includes(module.moduleSign)
        );

        // 2. 清理分类导航的角标
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
