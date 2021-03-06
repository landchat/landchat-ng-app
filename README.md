# LandChat NG

欢迎使用 LandChat！这是一个美观、简洁、易用的在线聊天网站。

软件暂时还在开发中，所以仍有大量的功能等待实现！

软件基于[LandChat-Server](https://github.com/landchat/landchat-server)构建，因此请先部署它。服务端基于PHP语言构建。您可以在任意域名下部署。

## 截图

![Snapshot](https://p.hywiki.xyz/2021/08/29/89757efa467bf.png)

## 使用

注意: 本项目依赖于 yarn 包管理器，因此请先安装 yarn（`npm install -g yarn`）。

### 安装

```bash
cd 您的项目部署路径
yarn
```

然后，请您查阅代码，修改`src/config.js`文件中的`title`和`endpoint`选项为您自己的。

### 运行

```bash
yarn start
```

访问`http://IP:7564/`即可！

### 构建生产版本

```bash
yarn build
```

静态文件将会生成在`/build`目录下。

## 使用到的技术

前端，由 ES6 编写，通过 create-react-app 脚手架搭建，使用 React 框架，@material-ui 组件库，React-router 路由系统，Babel 编译，webpack 打包。
后端，即 api server，使用 php 编写，数据库由 MySQLi 驱动。

## 近几次更新日志

### 1.0.5

增加Github Action自动构建支持。

### 1.0.4

1. 解决了一个定时器清除问题。
2. 同时将landchat-server开源。

### 1.0.3

1. 消息框固定；
2. 消息超出右侧导致出现滚动条问题修复；
3. 消息撤回界面 bug 修复；
4. 初步适配 iOS 15 所配套的 Safari 浏览器。

### 1.0.2

1. 消息撤回确认；
2. 深色模式跟随系统；
3. 修复一处连续请求的 bug。

### 1.0.1

1. 消息撤回功能添加；
2. 统一头像颜色；
3. 更改了一些图标。

### 1.0.0

1. 未登录用户隐藏消息发送框；
2. 登录优化: 使用异步方式，无需跳转；
3. 错误修复。

### 0.3.0.beta5-rc1

1. 修复主页用户名获取的 bug；
2. 目录整理；
3. 用户信息修改功能添加；
4. 首页优化；
5. 错误修复。

### 0.3.0.beta4

1. 修复一处重大 bug；
2. 静态资源后加载；
3. 自己的消息居右。

### 0.3.0.beta3

1. 修正一处表述错误；
2. 首页添加当前用户名；
3. 图片可点击放大。

### 0.3.0.beta2

1. 边栏改造为所有聊天室；
2. 注册页面改进；
3. 使用 BrowserHistory 代替 HashHistory。

### 0.3.0.beta1

1. Emoji 表情发送错误的问题，请切换 LandChat 数据库字符集为 utf8mb4；
2. 注册功能添加；
3. 首页样式改动；
4. KaTeX 公式渲染支持。

### 0.3.0.dev5

1. 增加一些微互动；
2. Bug 修复。

### 0.3.0.dev4

1. 图片发送支持；
2. 新的配色；
3. 消息发送逻辑优化；
4. Bug 修复；
5. Ctrl+Enter 发送支持。

### 0.3.0.dev3

1. 深色模式；
2. 消息处理逻辑优化；
3. 边栏支持，首页去除最近聊天室；
4. Bug 修复；
5. API 格式修改成标准 REST API。
