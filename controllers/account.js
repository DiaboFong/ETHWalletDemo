var web3 = require("../utils/myUtils").getWeb3()


async function getAccountBalance(address) {
    var balance = await web3.eth.getBalance(address);
    var balanceEther = web3.utils.fromWei(balance, 'ether')
    return balanceEther;
}



module.exports = {
    unlockWithPK: async (ctx) => {
        var privateKey = ctx.request.body.privatekey
        console.log(privateKey)
        var account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(account)
        var balance = await getAccountBalance(account.address)
        console.log(balance)
        responseData = {
            code: 0,
            status: "success",
            data: {
                balance: balance,
                address: account.address
            }
        }
        ctx.response.body = responseData
    }

}