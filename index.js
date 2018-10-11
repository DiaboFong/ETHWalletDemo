//引入Koa库
var Koa = require("koa")
//通过koa创建一个应用程序
var app = new Koa()

//导入./router/router包
var router = require("./router/router.js")
var static = require("koa-static")
var path = require("path")
var views = require("koa-views")
var koaBody = require("koa-body")

//拦截获取网络请求,自定义的function需要使用next()
app.use(async (ctx,next)=>{
    console.log(`${ctx.url} ${ctx.method}...`)
    await next();
})

//注册中间件
//注册静态文件的库到中间件
app.use(static(path.join(__dirname,"static")))
//注册模板引擎的库到中间件
app.use(views(path.join(__dirname,"views"),{extension:"ejs", map:{html: "ejs"}}))
//针对于文件上传时，可以解析多个字段
app.use(koaBody({multipart:true})) 
app.use(router.routes())
app.listen(3003)
console.log("钱包启动成功，请访问http://127.0.0.1:3003/...进行测试")