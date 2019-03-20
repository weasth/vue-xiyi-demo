module.exports = {
    publicPath:"./",    //  根路径
    outputDir:"dist",   //  构建输出目录
    assetsDir:"assets", //  静态资源输出目录(css,js,img,font)
    lintOnSave:false,   //  是否开启eslint保存检测
    devServer:{
        open:false,     //  启动项目是否自动开启浏览器
        host:"localhost",       //  主机名
        port:"8080",    //  端口号
        https:false,    //  是否开启https
        hotOnly:false,  //  热模块更新
        proxy:{
            //  配置跨域
            // "/api":{
            //     target:"http://localhost:80",
            //     ws:true,    //  是否跨域
            //     changeOrigin:true,
            //     pathRewrite:{
            //         "^/api":""  //  重写
            //     }
            // }
        }

    }
}