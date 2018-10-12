var web3 = require("../utils/myUtils").getWeb3()
var {success,fail} = require("../utils/myUtils")
var fs = require("fs")

async function getAccountBalance(address) {
    var balance = await web3.eth.getBalance(address);
    var balanceEther = web3.utils.fromWei(balance, 'ether')
    return balanceEther;
}



module.exports = {
    unlockWithPK: async (ctx) => {
        //1.获取私钥
        var privateKey = ctx.request.body.privatekey
        console.log(privateKey)
        //2.通过私钥解锁账户
        var account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(account)
        //3.获取账户余额
        var balance = await getAccountBalance(account.address)
        console.log(balance)
        ctx.response.body = success({
            balance:balance,
            address:account.address,
            privatekey:account.privateKey
        })
    },

    unlockWithKS: async (ctx) => {
        //获取前端传递的数据，password跟keystore
        var password = ctx.request.body.password
        console.log(password)
        var keystore = ctx.request.files.file
        console.log(keystore)
        //读取缓存文件中keystore的数据
        var keystoreData = fs.readFileSync(keystore.path, "utf8")
        console.log(keystoreData)
        // 通过keystore和密码解锁账户
        var account = web3.eth.accounts.decrypt(JSON.parse(keystoreData), password)
        console.log(account)
        //获取账户余额
        var balance = await getAccountBalance(account.address)
        console.log(balance)
        ctx.response.body = success({
            balance:balance,
            address:account.address,
            privatekey:account.privateKey
        })

         
    }
}