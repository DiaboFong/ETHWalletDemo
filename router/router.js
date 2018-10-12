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
//发送交易
router.post("/sendtransaction",transactionController.sendTransaction)
//查询交易详情
router.get("/queryTransaction.html",transactionController.queryTransactionHtml)
router.post("/queryTransaction",transactionController.queryTransaction)
//通过私钥解锁账户
router.post("/unlockWithPK",accountController.unlockWithPK);
//通过配置文件解锁账户
router.post("/unlockWithKS",accountController.unlockWithKS);

module.exports = router
