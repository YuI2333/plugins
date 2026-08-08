/*
 * 山姆去推荐脚本 v2
 * 精准处理：
 *   1. /spu/search              → 删除 trySearchKeywordResponse（试试搜这些）
 *   2. /spu/searchRecommendByKeyword → 清空推荐商品列表（为您推荐）
 * 原则：try-catch 兜底、保留响应骨架、异常即回退原始数据
 */

const url = $request.url;
let body = $response.body;

try {
    // 防御：body 异常直接放行
    if (!body || typeof body !== 'string') {
        return $done({ body });
    }

    const obj = JSON.parse(body);

    // 防御：非对象结构直接放行
    if (!obj || typeof obj !== 'object') {
        return $done({ body });
    }

    // 确保 data 存在且为对象
    if (!obj.data || typeof obj.data !== 'object') {
        return $done({ body });
    }

    // ==================== 接口 1：为您推荐 ====================
    if (url.includes('/searchRecommendByKeyword')) {
        // 清空推荐商品列表（保留 data 对象本身，防止前端判空异常）
        if (Array.isArray(obj.data.dataList)) {
            obj.data.dataList = [];
        }
        // 同步清零分页标识，避免前端触发二次加载
        if (obj.data.hasOwnProperty('totalCount')) {
            obj.data.totalCount = 0;
        }
        if (obj.data.hasOwnProperty('hasNextPage')) {
            obj.data.hasNextPage = false;
        }
        if (obj.data.hasOwnProperty('isNextPage')) {
            obj.data.isNextPage = false;
        }
        if (obj.data.hasOwnProperty('searchAfter')) {
            obj.data.searchAfter = [];
        }

        return $done({ body: JSON.stringify(obj) });
    }

    // ==================== 接口 2：试试搜这些 ====================
    if (url.includes('/spu/search') && !url.includes('searchRecommendByKeyword')) {
        // 删除「试试搜这些」
        if (obj.data.hasOwnProperty('trySearchKeywordResponse')) {
            delete obj.data.trySearchKeywordResponse;
        }

        // 防御性清理：其他可能携带推荐属性的字段
        const recommendKeys = [
            'trySearchKeywordResponse',
            'recommendList',
            'guessYouLike',
            'forYouList',
            'recommendSpuList',
            'searchRecommend'
        ];
        recommendKeys.forEach(key => {
            if (obj.data.hasOwnProperty(key)) {
                delete obj.data[key];
            }
        });

        return $done({ body: JSON.stringify(obj) });
    }

    // 其他未命中接口直接放行
    $done({ body });

} catch (err) {
    // 任何异常均返回原始响应，确保山姆App不闪退/不报错
    console.log(`[山姆去推荐] 异常拦截: ${err.message} | URL: ${url}`);
    $done({ body });
}
