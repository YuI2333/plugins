// 山姆搜索去推荐
// 过滤掉带有榜单推荐(tagMark=underThePrice)和评价推荐(tagMark=aboveTheLimitTag)的商品

const RECOMMEND_TAG_MARKS = ["underThePrice", "aboveTheLimitTag"];

function isRecommendItem(item) {
    if (!item || !item.tagInfo || !Array.isArray(item.tagInfo)) {
        return false;
    }
    return item.tagInfo.some(tag => RECOMMEND_TAG_MARKS.includes(tag.tagMark));
}

function removeRecommendItems(body) {
    try {
        const obj = JSON.parse(body);
        
        if (obj.data && Array.isArray(obj.data.dataList)) {
            let totalRemoved = 0;
            
            obj.data.dataList.forEach(dataItem => {
                if (Array.isArray(dataItem.spuItemsList)) {
                    const originalCount = dataItem.spuItemsList.length;
                    
                    // 过滤掉推荐商品
                    dataItem.spuItemsList = dataItem.spuItemsList.filter(item => {
                        const isRec = isRecommendItem(item);
                        if (isRec) {
                            console.log(`[山姆去推荐] 已过滤: ${item.title || '未知商品'}`);
                        }
                        return !isRec;
                    });
                    
                    totalRemoved += (originalCount - dataItem.spuItemsList.length);
                }
            });
            
            // 更新总数
            if (obj.data.totalCount !== undefined) {
                obj.data.totalCount = Math.max(0, obj.data.totalCount - totalRemoved);
            }
            
            console.log(`[山姆去推荐] 共过滤 ${totalRemoved} 个推荐商品`);
        }
        
        return JSON.stringify(obj);
    } catch (e) {
        console.log("[山姆去推荐] 解析失败: " + e.message);
        return body;
    }
}

const body = $response.body;
const modifiedBody = removeRecommendItems(body);
$done({ body: modifiedBody });
