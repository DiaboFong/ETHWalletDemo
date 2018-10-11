var web3 = require("../utils/myUtils").getWeb3()
var fs = require("fs")
var path = require("path")
module.exports = {
    homeHtml: async(ctx) =>{
        await ctx.render("home.html")
    },
    //获取创建账号的页面
    newAccountHtml: async (ctx) =>{
        await ctx.render("newaccount.html")
    },
    //表单提交被触发的方法
    newAccount: async (ctx) =>{
        console.log("newAccount");
        var password = ctx.request.body.password;
        //通过密码创建钱包账户
        var account = web3.eth.accounts.create(password);
        console.log(account.address);
        //根据账号私钥跟密码生成keystore文件
        var keystore = web3.eth.accounts.encrypt(account.privateKey, password);
        //keystore文件保存到文件中,
       
        var keystoreString = JSON.stringify(keystore);
         //格式如下:UTC--Date--Adress
         //UTC--2018-09-26T05-07-57.260Z--937d091780693ab7f51331bb52797a9267bb9ed2
        var fileTime = new Date().toDateString()
        var fileName = 'UTC--' + fileTime + '--' + account.address.slice(2) ;
        var filePath = path.join(__dirname,"../static/keystore",fileName)
        fs.writeFileSync(filePath,keystoreString)
        await ctx.render("downloadkeystore.html",{
            "downloadurl":path.join("keystore",fileName),
            "privatekey":account.privateKey
        })
    }
}