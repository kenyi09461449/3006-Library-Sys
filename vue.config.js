module.exports = {

  //关闭语法检查
  //Turn off grammar check
  lintOnSave:false,
  //开启代理服务器
  //Enable proxy server
  devServer: {
    //配置本地默认端口：支撑脚手架和代理服务器自身端口
    //Configure local default ports: support scaffolding and proxy server's own ports
    port: 9527,   
    proxy: {
      '/api': {   //请求前缀，axios请求前缀为api的走代理 //Request prefix, axios requests proxy with API prefix
        target: 'http://localhost:8080',  //代理的目标服务器//Target server for proxy
        pathRewrite:{'^/api':''}, // 请求路径重写，把以api开头的这部分地址替换为空字符串//Request path rewrite to replace the addresses starting with the API with empty strings
        changeOrigin: true //用于控制请求头中的host值//Used to control the host value in the request header
      }
    }
  }
}