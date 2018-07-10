//const pageMapHash = '';
const PAGEMAPHASH = null;

// 跳转远程bundle的url
let timer = null;
export function jumpRemotePage(options, querystring) {
    const baseUrl = PAGEMAPHASH ? new Buffer(PAGEMAPHASH, 'hex').toString() : '';
    const token = baseUrl.slice(-1, 16);
    let bundleUrl = typeof options === 'string' ? options : (options.weexPage ? options.weexPage : '');
    bundleUrl += baseUrl;
    if (typeof querystring === 'object' && querystring !== null) {
        bundleUrl += stringifyParamets(querystring, token) ? ('/' + stringifyParamets(querystring, token)) : '';
    }
    // hack
    clearTimeout(timer);
    timer = setTimeout(() => {
        weex.requireModule('navigator').push({
            'url': typeof options === 'string' ? bundleUrl : 'wxhellotalk://weex/' + bundleUrl,
            'animated': 'true'
        }, function(event) {
            // console.log(event);
        });
    }, 200);
}

//加密组装queryString
function stringifyParamets(obj, token) {
    let str = '';
    if (!obj || Object.keys(obj).length === 0) {
        return str;
    }
    for (let key in obj) {
        str += (key + '=' + encodeURIComponent(obj[key]) + '&');
    }
    let stringifyStr = xtea.xTEAEncryptWithKey(str.substr(0, str.length - 1), token); //进行加密
    stringifyStr = toBuffer(stringifyStr);
    return new Buffer(token).toString('hex') + stringifyStr.toString('hex');
}

function getQueryString(str) {
    let result = str.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    if (result == null) {
        return "";
    }
    for (let i = 0; i < result.length; i++) {
        result[i] = result[i].substring(1);
    }
    return result;
}
// 提取页面上的参数
export function parseQueryString(str) {
    if (typeof str !== 'string') {
        return '';
    }
    let obj = {};
    if (getQueryString(str) && getQueryString(str).forEach) {
        getQueryString(str).forEach(item => {
            obj[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
        });
    }
    return obj;
}
