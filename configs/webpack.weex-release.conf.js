const weexConfig = require('./webpack.weex.conf');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const AliyunOSSPlugin = require("aliyun-oss-webpack-plugin");//阿里云上传插件
const config = require('./config');
/*
 * 将文件上传到某服务器上
 */
const releaseConfig = webpackMerge(weexConfig[1], {
    output: {
        publicPath: config.weex.cdn.cdnUrl
    },
    plugins: [
        new AliyunOSSPlugin({
            accessKeyId: config.weex.cdn.accessKeyId,
            accessKeySecret: config.weex.cdn.accessKeySecret,
            region: config.weex.cdn.region,
            bucket: config.weex.cdn.bucket
        })
    ]
})
module.exports = releaseConfig;
