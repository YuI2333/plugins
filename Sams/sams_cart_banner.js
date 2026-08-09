let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        let data = obj.data;
        
        if (data) {
            // 去除顶部天气延迟滚动文字
            if (data.bannerInfo) {
                data.bannerInfo.deliveryDelayTipsNewList = [];
                data.bannerInfo.deliveryDelayTips = "";
            }
            
            // 去除“全城配升级”相关提示文字
            if (Array.isArray(data.floorInfoList)) {
                for (let i = 0; i < data.floorInfoList.length; i++) {
                    let floor = data.floorInfoList[i];
                    if (floor) {
                        // 精准匹配并置空，避免误杀其他正常提示
                        if (floor.floorDeliveryNewDesc && floor.floorDeliveryNewDesc.indexOf("全城配") !== -1) {
                            floor.floorDeliveryNewDesc = "";
                        }
                        if (floor.floorDeliveryDesc && floor.floorDeliveryDesc.indexOf("全城配") !== -1) {
                            floor.floorDeliveryDesc = "";
                        }
                        if (floor.floorDeliveryDescTwo && floor.floorDeliveryDescTwo.indexOf("全城配") !== -1) {
                            floor.floorDeliveryDescTwo = "";
                        }
                        if (floor.floorDeliveryDescThree && floor.floorDeliveryDescThree.indexOf("配送时段随心选") !== -1) {
                            floor.floorDeliveryDescThree = "";
                        }
                    }
                }
            }
        }
        
        body = JSON.stringify(obj);
    } catch (e) {
        // 静默处理，发生错误时返回原始数据，防止客户端报网络错误
    }
}

$done({ body });
