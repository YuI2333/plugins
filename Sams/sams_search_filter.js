try {
    let body = JSON.parse($response.body);
    
    if (body && body.data) {
        // 清空推荐数据列表
        if (body.data.dataList) {
            body.data.dataList = [];
        }
        // 清空筛选项，避免UI出现无效的筛选条件
        if (body.data.searchFilterList) {
            body.data.searchFilterList = [];
        }
        if (body.data.cardFilterList) {
            body.data.cardFilterList = [];
        }
        // 将总数和分页状态置零/关闭
        if (body.data.totalCount !== undefined) {
            body.data.totalCount = 0;
        }
        if (body.data.pageSize !== undefined) {
            body.data.pageSize = 0;
        }
        if (body.data.hasNextPage !== undefined) {
            body.data.hasNextPage = false;
        }
        if (body.data.isNextPage !== undefined) {
            body.data.isNextPage = false;
        }
    }
    
    // 返回修改后的完整结构，避免APP报网络或解析错误
    $done({ body: JSON.stringify(body) });
} catch (e) {
    console.log("山姆APP搜索推荐过滤脚本报错: " + e);
    // 发生异常时原样返回，确保APP可用
    $done({});
}
