import Vue from 'vue';
import weex from 'weex-vue-render';
weex.init(Vue);
const meta = weex.requireModule('meta');
meta.setViewport({
    width:  weex.config.env.deviceWidth / weex.config.env.drp || 375
});
