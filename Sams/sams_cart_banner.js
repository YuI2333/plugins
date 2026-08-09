let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        let data = obj.data;
        
        if (data) {
            if (data.bannerInfo) {
                data.bannerInfo.deliveryDelayTipsNewList = [];
                data.bannerInfo.deliveryDelayTips = "";
            }
            
            if (Array.isArray(data.floorInfoList)) {
                for (let i = 0; i < data.floorInfoList.length; i++) {
                    let floor = data.floorInfoList[i];
                    if (floor) {
                        if (floor.floorDeliveryNewDesc && (floor.floorDeliveryNewDesc.includes("全城配") || floor.floorDeliveryNewDesc.includes("最快1小时"))) {
                            floor.floorDeliveryNewDesc = "";
                        }
                        if (floor.floorDeliveryDesc && (floor.floorDeliveryDesc.includes("全城配") || floor.floorDeliveryDesc.includes("最快1小时"))) {
                            floor.floorDeliveryDesc = "";
                        }
                        if (floor.floorDeliveryDescTwo && floor.floorDeliveryDescTwo.includes("全城配")) {
                            floor.floorDeliveryDescTwo = "";
                        }
                        if (floor.floorDeliveryDescThree && floor.floorDeliveryDescThree.includes("配送时段随心选")) {
                            floor.floorDeliveryDescThree = "";
                        }
                    }
                }
            }
        }
        
        body = JSON.stringify(obj);
    } catch (e) {
    }
}

$done({ body });
