# 模版说明  
此模板根据weex的官方文件添加属于HelloTalk的的weex项目的特殊需求修改的项目模版  
##  特殊性：  
1.只将pageDir目录（默认为 ./src/page）里的vue文件打包成一个单独的客户端可运行的js文件
2.添加了 npm run weex 命令来打包文件（默认输出路径：./release/weex/.....js），如需直接上传阿里云，使用npm run weex:release命令  
3.在./src/util.js中添加了针对HelloWork客户端开发所需要的公共方法  
4.navigator.gotoPage为HelloTalk客户端提供的特殊接口（[接口列表](https://www.tapd.cn/20331431/markdown_wikis/#1120331431001000852)）  
5.如需上传阿里云，请配置config.js文件中的cdn服务器参数([参数配置说明](https://npm.taobao.org/package/aliyunoss-webpack-plugin))  
```javascript
weex: {
  cdn: {
      cdnUrl: '',
      accessKeyId: '',
      accessKeySecret: '',
      region: '',
      bucket: ''
  }
}
```
6.要求样式尺寸按照375px来写。见./src/pageEntry.js，这个文件只有weex客户端才加载，网页端加载的文件为./src/entry.js
```javascript
const meta = weex.requireModule('meta');
meta.setViewport({
  width: weex.config.viewport || 375
});
//设置客户端页面的显示宽度为客户端的页面点数
```
