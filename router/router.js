var router = require("koa-router")()
var newAccount = require("../controllers/newAccount")

router.get("/",newAccount.homeHtml)
//创建账号的页面
router.get("/newaccount.html",newAccount.newAccountHtml)
//提交创建账号表单
router.post("/newaccount",newAccount.newAccount)

module.exports = router
