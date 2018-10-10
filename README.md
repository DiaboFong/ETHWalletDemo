

# 			ETHWalletDemo开发学习手册

|  修订日期  |   姓名    |          邮箱           |
| :--------: | :-------: | :---------------------: |
| 2018-10-10 | brucefeng | brucefeng@brucefeng.com |



## 前言

在之前的一篇文章[以太坊智能合约项目-Token合约开发与部署](http://blog.51cto.com/clovemfong/2170725)中，我们提到了钱包了钱包的概念以及主流的几种钱包，如**Mist**,**MyEtherWallet**,**MetaMask**等，之前我们主要将钱包作为一个开发工具使用，用于智能合约的开发与调试工作，使用较多的是浏览器插件钱包**MetaMask**。

在本文中，我们主要介绍**MyEtherWallet**以及如何实现一个简易版的**MyEtherWallet**网页版应用，在本文中，我们能够学习到如下内容

* node.js开发基础
* web3.js API使用
* 以太币转账实现
* Token转账实现

目前主流的钱包平台已经有太多了，而且有很多已经做得比较完善了，所以我们本文的开发工作只是为了学习以太坊开发技术，并非去设计一个新的钱包软件，重复造轮子几乎没有任何价值。





## 一. MyEtherWallet介绍

[MyEtherWallet](https://www.myetherwallet.com/) 是一个轻钱包，无需下载，所有操作在直接在网页上就可以完成

![](https://brucefeng-1251273438.cos.ap-shanghai.myqcloud.com/1.png?q-sign-algorithm=sha1&q-ak=AKIDeEUrXi5Nck40rHuNfwbPhZY5V9v2WPtb&q-sign-time=1539176823;1539178623&q-key-time=1539176823;1539178623&q-header-list=&q-url-param-list=&q-signature=9219ba10e67a87be5ddf6a60e8f3ced47d62ad7f&x-cos-security-token=5f78d92d11f0e1bc32d935c6d22b51327700fa7110001&response-content-disposition=attachment)

**主要功能如下**

* Net Wallet : 新建钱包
* Send Ether && Tokens ：以太币或者Token转账
* Contract: 部署智能合约
* ENS：以太坊域名平台
* Check TX Status: 查看交易状态
* View Wallet Info: 查看钱包信息

由于操作比较简单，这里不做详细讲解，在下文中我们对其主要功能，如新建钱包，以太币或者Token转账，查看交易状态进行参照开发。



## 二.node.JS与web.js

### 1.Node.js

Node.js是一个JS运行时环境，可以解析，执行JavaScript代码，在这个执行环境中，为JS提供了一些服务器级别的操作API,如文件读写，网络通信，Http服务器等，其使用事件驱动，非阻塞IO模型(异步)，轻量高效，大多数与JS相关的包都放在npm上，通过命令就可以下载不同的库跟框架，无需在去各个模块的官网上面单独下载，如安装koa直接通过`npm install koa`即可完成。

### 2. Web3.js

web3.js是一个库集合，允许使用HTTP或者RPC连接与本地或者远程以太坊节点进行交互，包含以太坊生态系统的特定功能，开发者利用web3模块主要连接以太坊的RPC层，从而与区块链进行交互

* web3-eth :  与以太坊区块链和智能合约之间的交互
* web3-ssh:   用于进行通信的p2p和广播
* web-bzz:     用于群协议，分散的文件存储
* web3-utils: 主要用于Dapp开发的辅助函数

### 3. Koa中间件

Koa号称是基于Node.js平台的下一代web开发框架，Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

> 其使用方法可以参考https://koa.bootcss.com/

Koa的最大特色就是中间件，Koa中间件是简单的函数，调用app.user()传入，MiddlewareFunction函数带有两个参数(ctx,next),中间件作为HTTP Request和HTTP Reponse的桥梁，用来实现连接功能，如

```
app.use(async (ctx, next) =>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    await next();
});
```

ctx是一个请求的上下文，封装了传入的http消息，并对该消息进行响应，koa提供了一个Request/Response对象提供了Context的request/response属性与用于处理Http请求的方法。

next是被调用来执行上下游中间件的函数，必须手动调用next()运行下游中间件，否则下游中间件不会被正常执行。可以采用两种不同的方法来实现中间件

* async function
* common function

#### (1) 安装启动Koa服务

* 安装koa

```
$ mkdir koaTest ; cd koaTest
$ npm init -y
$ npm install koa
```

* 创建启动文件

```
$ vim index.js
```

```js
var Koa = require("koa") //导入Koa库
var app = new Koa();     //创建Koa应用对象，带有node http服务的koa接口
app.listen(3003); //启动服务的快捷方法
```

* 启动服务

```
$ node index.js
```

> 此时会监听3003端口，通过浏览器访问

#### (2) Context

context是一个请求的上下文，该对象封装了一个传入的http消息，context有request和response属性，我们可以通过涉案值两个属性来处理和相应不同的请求。

```
$ vim index.js
```

```js
var Koa = require("koa");
var app = new Koa();
//
app.use(function(ctx,next){
    console.log(ctx.request.path);
    //通过设置ctx的response的body值可以返回数据到客户端
    ctx.response.body = "my koa app";
    console.log(ctx.response.type);
});
app.listen("3003");
console.log("koa server is listening on port 3003");


```

* app.use(function)：将给定的function作为中间件加载到应用中。
* ctx: 每一个请求都会创建一段上下文，在控制业务逻辑的中间件中，上下文被寄存在ctx对象中，许多上线文属性和方法都被存在ctx.request和ctx.response中，比如访问ctx.type和ctx.length都被代理到reponse对象，ctx.path和ctx.method都被代理到request对象中。

#### (3) 网页模板

在实际开发中，返回给用户的网页都是通过模板文件进行返回的，可以让Koa先读取模板文件，然后将这个模板返回给用户，需要指定response的type为`text/html`类型

```js
var Koa = require("koa");
var app = new Koa();
var fs = require("fs");
app.use(ctx=>{
    console.log(ctx.path);
    //必须指定type
    ctx.type = "text/html";
 	ctx.body = fs.createReadStream("./views/teest.html");
 	console.log(ctx.type);
});
app.listen(3003);
console.log("koa server is listening on port 3003");
```

#### (4) 中间件

Koa所有的功能都是通过中间件实现的，中间件处于HTTP Request和HTTP Response之间。

Koa的中间件之间按照编码书序在栈内以此执行，允许执行操作并向下传递请求，之后过滤并必须返回响应，响应的测试代码与步骤如下

```
var Koa = require("koa");
var app = new Koa();
//es6新语法:
//函数名 =>(参数) =>{}


var one = (ctx,next) =>{
    console.log("1.1");
    next();
    console.log("1.2");
};

var two = (ctx,next) =>{
    console.log("2.1");
    next();
    console.log("2.2");
};

var three = (ctx, next) =>{
    console.log("3.1");
    next();
    console.log("3.2");
};

app.use(one);
app.use(two);
app.use(three);

app.listen(3003);
console.log("服务启动完毕");
```

返回结果

```
2.1
3.1
3.2
2.2
1.2
```

(5) 异步中间件

由async标记的函数被称为异步函数，在异步函数中，可以通过await调用另外一个异步函数，使用await时，其所在的方法必须使用关键字async

```js
var Koa = require("koa");
var app = new Koa();
app.use(async(ctx,next) =>{
    var start = Date.now();
    await next();
    console.log(`${ctx.url} ${Date.now - start}`);
});
app.use(async (ctx,next)=>{
    ctx.response.body = "async test"
});
app.listen(3003);
console.log("服务启动完毕");
```



(6) 原生路由

```js
var Koa = require("koa");
var app = new Koa();
//es6新语法:
//函数名 =>(参数) =>{}
app.use((ctx,next)=> {
    console.log("%s %s", ctx.method, ctx.url);
    next();
});

app.use((ctx,next) =>{
    if (ctx.request.path == '/'){
        ctx.response.body = 'index page';
    }else {
        next();
    }
});

app.use((ctx,next) =>{
    if (ctx.request.path == '/error'){
        ctx.response.body = 'error page';
    }
});



app.listen(3003);
console.log("服务启动完毕");
```



## 三.初始化项目环境







## 四.创建钱包账户

### 1.创建钱包账户



### 2.下载配置文件



### 3.网页前端设计



## 五.解锁钱包账户

### 1. 通过私钥解锁账户



### 2. 通过配置文件解锁账户



## 六.实现交易转账

### 1. 以太币转账

### 2. Token转账



## 七.附录



