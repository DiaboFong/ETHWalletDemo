var web3 = require("../utils/myUtils").getWeb3()

module.exports = {
    unlockWithPK: (ctx) => {
        var privateKey = ctx.request.body.privatekey
        console.log(privateKey)
        var account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(account)
        ctx.response.body = "解锁成功";
    }
}