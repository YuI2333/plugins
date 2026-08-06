try {
    let obj = JSON.parse($response.body);
    
    delete obj.msg;
    
    if (obj.result) {
        delete obj.result.notify_description;
        delete obj.result.description;
        delete obj.result.sign_in_coin;
        delete obj.result.sign_in_exp;
        delete obj.result.level_info;
    }
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
