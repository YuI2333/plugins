const url = $request.url;
const binaryBody = typeof $task !== "undefined" ? new Uint8Array($response.bodyBytes) : $response.body;

if (url.includes("frs/threadlist")) {
    console.log('贴吧-threadlist');
    
    // 1. 反序列化 Protobuf 响应数据
    const threadListResIdlObj = ThreadListResIdl.fromBinary(binaryBody, {readUnknownField: true});

    // 2. 核心去广告操作：遍历 bannerList 中的 app，清空 goodsInfo
    const appList = threadListResIdlObj.data?.bannerList?.app;
    if (appList?.length) {
        let goodsInfoSize = 0;
        appList.forEach(item => {
            if (item.goodsInfo?.length) {
                goodsInfoSize++;
                item.goodsInfo = []; // 将商品/广告信息置空
            }
        });
        if (goodsInfoSize) {
            console.log(`去除goods_info:${goodsInfoSize}`);
        }
    }

    // 3. 将修改后的对象重新序列化并回写
    const body = ThreadListResIdl.toBinary(threadListResIdlObj);
    
    if (typeof $task !== "undefined") {
        // Quantumult X 格式
        $done({bodyBytes: body.buffer.slice(body.byteOffset, body.byteLength + body.byteOffset)});
    } else {
        // Loon / Surge 格式
        $done({body});
    }
} else {
    $done({});
}
