// 引入BlockAdBlock库
import BlockAdBlock from 'blockadblock';

// 初始化 BlockAdBlock
var blockAdBlock = new BlockAdBlock({
    checkOnLoad: true,
    resetOnEnd: true
});

// 检测广告拦截插件
blockAdBlock.onDetected(function() {
    alert('检测到广告拦截插件，请禁用广告拦截以显示所有内容！本站承诺永远无广！');
});

blockAdBlock.onNotDetected(function() {
    console.log('没有检测到广告拦截插件');
});
