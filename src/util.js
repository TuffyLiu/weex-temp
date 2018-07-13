const navigator = weex.requireModule('navigator');
/*
 * 根据page名跳转对应的页面 web测试端/native端
 * @param options {weexPage:'index'}  querystring {id: 9, name:'rrr'}
 */
function jumpPage(options, query) {
    let bundleUrl = weex.config.bundleUrl;
    let platform = weex.config.env.platform;
    if (typeof options === 'string') {
        /*
         * jump to exact url
         */
        bundleUrl = options;
        navigatorJump(bundleUrl, query);
    } else if (navigator.gotoPage) {
        /*
         * jump by HelloTalk native
         */
        navigator.gotoPage(
            {
                url: options.weexPage,
                data: query
            }, (e) => {
                console.log(e);
            });
    } else {
        /*
         * jump for test
         */
        let weexPage = options.weexPage + (platform === 'Web' ? '.html' : '.js');
        let filePath = bundleUrl.match(/.+\/(.+)$/)[1];
        bundleUrl = bundleUrl.replace(filePath, weexPage);
        navigatorJump(bundleUrl, query);
    }
}

/*
 * 调用原生的weex跳转
 * @param options {weexPage:'index'}  querystring {id: 9, name:'rrr'}
 */
function navigatorJump(bundleUrl, query) {
    bundleUrl += '?' + objToParams(query);
    navigator.push({
        url: bundleUrl,
        animated: 'true'
    }, e => {
        console.log(e);
    });
}

/*
 * 转换 obj 为 url params参数
 * @param obj 传入字符串
 * @returns {String}
 */
function objToParams(obj) {
    let str = '';
    for (let key in obj) {
        if (str !== '') {
            str += '&';
        }
        str += key + '=' + encodeURIComponent(obj[key]);
    }
    return str;
}
/*
 * 转换 url params参数为obj
 * @param str 传入url参数字符串
 * @returns {Object}
 */
function paramsToObj(str) {
    let obj = {};
    try {
        obj = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    } catch (e) {
        console.log(e);
    }
    return obj;
}
export {
    objToParams,
    paramsToObj,
    jumpPage
};
