import xtea from 'customize_xtea';
const navigator = weex.requireModule('navigator');
const stream = weex.requireModule('stream');
const Buffer = require('buffer/').Buffer;
const player = weex.requireModule('playerModule');
const ENV = 'dev';
let JumpTimer = null;
let pageMap = null;
const modal = weex.requireModule('modal');
const utils = {
    /*
     * throttle 函数截流，以防多次点击跳转
     */
    jumpPage(options, query) {
        if (JumpTimer) {
            clearTimeout(JumpTimer);
        }
        JumpTimer = setTimeout(() => {
            utils.jumpPageTemp(options, query);
        }, 100);
    },
    /**
     * jump back by navigator pop
     */
    goBack() {
        if (player) {
            player.clear();
        }
        navigator.pop({
            'animated': 'true'
        });
    },
    /**
     * HelloTalk App Api to shut all weex page
     */
    shutDownStack(callBack) {
        if (player) {
            player.clear();
        }
        if (navigator.shutDownStack) {
            navigator.shutDownStack(callBack);
        } else {
            utils.goBack();
        }
    },
    /*
     * 根据page名跳转对应的页面 web测试端/native端
     * @param options {weexPage:'index'}  query {id: 9, name:'rrr'}
     */
    jumpPageTemp(options, query) {
        let bundleUrl = weex.config.bundleUrl;
        let platform = weex.config.env.platform;
        if (typeof options === 'string') {
            /*
             * jump to exact url
             */
            bundleUrl = options;
        } else if (navigator.gotoPage) {
            /*
             * jump by HelloTalk native
             */
            let weexPage = options.weexPage + '.js';
            let filePath = bundleUrl.match(/.+\/(.+)$/)[1];
            if (ENV === 'pro') {
                // 正式环境
                navigator.gotoPage({
                    url: options.weexPage,
                    data: query
                }, (e) => {
                    console.log(e);
                });
                return true;
            } else if (ENV === 'test') {
                // 测试环境
                if (pageMap) {
                    utils.jumpPageByMap(weexPage, query);
                } else {
                    utils.jumpByManifest((map = {}) => {
                        utils.jumpPageByMap(weexPage, query);
                    });
                }
                return true;
            } else {
                // 开发环境
                bundleUrl = bundleUrl.replace(filePath, weexPage);
                bundleUrl = utils.urlEncrypt(bundleUrl, query);
            }
        } else {
            /*
             * jump for test
             */
            let weexPage = options.weexPage + (platform === 'Web' ? '.html' : '.js');
            let filePath = bundleUrl.match(/.+\/(.+)$/)[1];
            bundleUrl = bundleUrl.replace(filePath, weexPage);
            bundleUrl += '?' + utils.objToParams(query);
        }
        utils.navigatorJump(bundleUrl);
    },
    /**
     * [根据pageMap跳转页面]
     * @param  {[type]} weexPage [page.js]
     */
    jumpPageByMap(weexPage, query) {
        let bundleUrl = pageMap[weexPage] || weexPage;
        bundleUrl = utils.urlEncrypt(bundleUrl, query);
        utils.navigatorJump(bundleUrl);
    },
    /**
     * [将链接加密]
     * @param  {[String]} bundleUrl [加密前的链接]
     * @return {[String]}           [加密后的链接]
     */
    urlEncrypt(bundleUrl, query) {
        if (query) {
            bundleUrl += '?' + utils.objToParams(query);
        }
        // HelloTalk weexPage编译前缀
        const HelloTalk = 'wxhellotalk://weex/';
        const token = utils.randomString(16);
        const stringifyStr = xtea.xTEAEncryptWithKey(bundleUrl, token); // 进行加密
        //  转化成二进制
        return HelloTalk + new Buffer(token).toString('hex') + utils.toBufferString(stringifyStr);
    },
    /**
     * [请求manifest.jso获取mappage]
     * @param  {[Function]} callBack [请求后的回调]
     */
    jumpByManifest(callBack) {
        const bundleUrl = weex.config.bundleUrl;
        const filePath = bundleUrl.match(/.+\/(.+)$/)[1];
        const manifestUrl = bundleUrl.replace(filePath, 'manifest.json');
        stream.fetch({
            method: 'GET',
            url: manifestUrl,
            type: 'json'
        }, (ret) => {
            pageMap = ret.data;
            if (callBack) {
                callBack(ret.data);
            }
        });
    },
    /*
     * 调用原生的weex跳转
     * @param options {weexPage:'index'}  query {id: 9, name:'rrr'}
     */
    navigatorJump(bundleUrl) {
        navigator.push({
            url: bundleUrl,
            animated: 'true'
        }, e => {
            console.log(e);
        });
    },
    /*
     * 转换 obj 为 url params参数
     * @param obj 传入字符串
     * @returns {String}
     */
    objToParams(obj) {
        let str = '';
        for (let key in obj) {
            if (str !== '') {
                str += '&';
            }
            str += key + '=' + encodeURIComponent(obj[key]);
        }
        return str;
    },
    /*
     * 转换 url params参数为obj
     * @param str 传入url参数字符串
     * @returns {Object}
     */
    paramsToObj(str) {
        let obj = {};
        try {
            obj = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        } catch (e) {
            console.log(e);
        }
        return obj;
    },
    getUrlParams() {
        const bundleUrl = weex.config.bundleUrl;
        let params = bundleUrl.split('?')[1];
        params = params ? utils.paramsToObj(params) : {};
        return params;
    },
    isWeb() {
        const {
            platform
        } = weex.config.env;
        return typeof (window) === 'object' && platform.toLowerCase() === 'web';
    },
    isIOS() {
        const {
            platform
        } = weex.config.env;
        return platform.toLowerCase() === 'ios';
    },
    isIPhoneX() {
        const {
            deviceHeight
        } = weex.config.env;
        const typeWin = typeof window;
        if (utils.isWeb()) {
            return (typeWin !== undefined) && window.screen && window.screen.width && window.screen.height && (parseInt(window.screen.width, 10) === 375) && (parseInt(window.screen.height, 10) === 812);
        }
        return utils.isIOS() && deviceHeight === 2436;
    },
    isAndroid() {
        const {
            platform
        } = weex.config.env;
        return platform.toLowerCase() === 'android';
    },
    /**
     * 获取weex屏幕真实的设置高度，需要减去导航栏高度
     * @returns {Number}
     */
    getPageHeight() {
        const {
            env,
            viewport
        } = weex.config;
        const dpr = env.scale * env.dpr || env.scale;
        const viewportWidth = viewport || (env.deviceWidth / dpr);
        const navHeight = utils.isWeb() ? 0 : (utils.isIPhoneX() ? 86 : 68);
        return env.deviceHeight / env.deviceWidth * viewportWidth - navHeight;
    },
    /**
     * 获取weex屏幕真实的设置高度
     * @returns {Number}
     */
    getScreenHeight() {
        const {
            env,
            viewport
        } = weex.config;
        const dpr = env.scale * env.dpr || env.scale;
        const viewportWidth = viewport || (env.deviceWidth / dpr);
        return env.deviceHeight / env.deviceWidth * viewportWidth;
    },
    getPageWidth() {
        const {
            env,
            viewport
        } = weex.config;
        const dpr = env.scale * env.dpr || env.scale;
        const viewportWidth = viewport || (env.deviceWidth / dpr);
        return viewportWidth;
    },
    /**
     * 生成随机字符串
     * @returns {String}
     */
    randomString(len) {
        len = len || 32;
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    /**
     * 将buffer转化成字符
     * @param ab {Buffer}
     * @returns {String}
     */
    toBufferString(ab) {
        let buffer = new Buffer(ab.byteLength);
        const view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer.toString('hex');
    },
    /**
     * fetch data
     * @type {[type]}
     */
    get(url, query, callBack) {
        this.addDefaultParams((params) => {
            query = Object.assign(params, query);
            url += '?' + utils.objToParams(query);
            stream.fetch({
                method: 'GET',
                url: url,
                type: 'json'
            }, (ret) => {
                console.log(ret);
                if (ret.status === 200 && ret.data.status === 0) {
                    if (callBack) {
                        callBack(ret.data.data);
                    }
                } else {
                    modal.toast({
                        message: ret.data.message || 'Opps!!!!',
                        duration: 3
                    });
                }
            });
        });
    }
};
if (ENV === 'test') {
    utils.jumpByManifest();
}
export {
    utils
};
