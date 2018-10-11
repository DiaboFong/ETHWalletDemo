var router = require("koa-router")();
var newAccount = require("../controllers/newAccount");
var transactionController = require("../controllers/transaction");
var accountController = require("../controllers/account")

router.get("/",newAccount.homeHtml);
//创建账号的页面
router.get("/newaccount.html",newAccount.newAccountHtml);
//提交创建账号表单
router.post("/newaccount",newAccount.newAccount);

//获取转账页面
router.get("/transaction.html",transactionController.transactionHtml);
router.post("/unlockWithPK",accountController.unlockWithPK);

module.exports = router
