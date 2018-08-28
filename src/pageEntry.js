const meta = weex.requireModule('meta');
meta.setViewport({
    width: weex.config.viewport || (weex.config.env.deviceWidth / weex.config.env.scale * (weex.config.env.drp || 1))
});
