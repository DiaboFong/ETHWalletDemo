var router = require("koa-router")()
router.get("/newaccount",(ctx,next)=>{
    ctx.response.body = "创建钱包"
})



module.exports = router
