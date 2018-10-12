var { success, fail } = require("../utils/myUtils")
var web3 = require("../utils/myUtils").getWeb3()
module.exports = {
    transactionHtml: async (ctx) => {
        await ctx.render("transaction.html")
    },
    sendTransaction: async (ctx) => {
        var { fromAddress, toAddress, amount, privateKey } = ctx.request.body
        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privateKey.slice(2), 'hex')
        var nonce = await web3.eth.getTransactionCount(fromAddress)
        var gasPrice = await web3.eth.getGasPrice()
        var amountToWei = web3.utils.toWei(amount, 'ether')

        var rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: '0x2710',
            to: toAddress,
            value: amountToWei,
            data: '0x00'
        }
        //对交易的数据进行gas计算，然后将gas值设置到参数中
        var gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        var responseData;

        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, data) {
            console.log(err)
            console.log(data)
            if (err) {
                responseData = fail(err)
            }
        }).then(function (data) {
            console.log(data)
            if (data) {
                responseData = success({
                    "blockHash": data.blockHash,
                    "transactionHash": data.transactionHash
                })
            } else {
                responseData = fail("交易失败")
            }
        })
        ctx.response.body = responseData

    },
    queryTransactionHtml: async (ctx) => {
        await ctx.render("queryTransaction.html")
    },
    queryTransaction: async (ctx) => {
        var txHash = ctx.request.body.txHash
        await web3.eth.getTransaction(txHash, function (err, res) {
            if (err) {
                responseData = fail(err)
            } 
        }).then(function(res){
            if (res) {
                responseData = success(res)
            }else {
                responseData = fail("查询失败")
            }
        })
        ctx.response.body = responseData

    }
}


