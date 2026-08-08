/**
 * 山姆会员商店 - 搜索结果过滤
 * 功能：清空搜索结果 dataList，保持 JSON 结构完整，防止 App 报网络错误
 * 适配：Loon / Surge / Quantumult X
 */

const body = $response.body;

try {
    let obj = JSON.parse(body);
    
    if (obj && obj.data) {
        // 清空商品列表（核心：屏蔽搜索内容）
        obj.data.dataList = [];
        
        // 重置分页与计数，避免前端异常
        obj.data.totalCount = 0;
        obj.data.hasNextPage = false;
        if (obj.data.pageSize !== undefined) {
            obj.data.pageSize = 0;
        }
        
        // 确保外层状态码正常，防止 App 提示网络错误
        obj.rt = 0;
        obj.code = "Success";
        obj.errorMsg = "";
        obj.msg = "";
        obj.success = true;
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (err) {
    console.log("山姆搜索过滤脚本异常: " + err);
    // 异常时原样返回，绝不断流
    $done({});
}
