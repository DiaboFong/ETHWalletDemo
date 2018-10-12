

# 					  以太坊网页钱包开发手册

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

**相关内容请参照博客**: http://blog.51cto.com/blogger/success/2299479