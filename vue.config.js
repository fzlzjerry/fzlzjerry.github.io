const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'  // Change to root path
    : '/',                     // 开发环境使用根路径
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/md',
            to: 'md',
            noErrorOnMissing: true
          }
        ]
      })
    ]
  }
})
