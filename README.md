# LandChat NG

欢迎使用 LandChat！这是一个美观、简洁、易用的在线聊天网站。

软件暂时还在开发中，所以仍有大量的功能等待实现！

软件基于[LandChat](https://github.com/landchat/landchat)服务端构建，因此请先部署 LandChat。您需要把两个应用部署在同一个根域名下以共享 Cookies.

## 截图

![Snapshot](https://p.hywiki.xyz/2021/08/29/89757efa467bf.png)

## 使用

### 安装

```bash
npm install
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
<<<<<<< HEAD
前端，由ES6编写，通过create-react-app脚手架搭建，使用React框架，@material-ui组件库，React-router路由系统，Babel编译，webpack打包。
后端，即api server，使用php编写，数据库由MySQLi驱动。

## 近几次更新日志

### 0.3.0.dev5

1. 增加一些微互动；
2. Bug修复。
=======

前端，由 ES6 编写，通过 create-react-app 脚手架搭建，使用 React 框架，@material-ui 组件库，React-router 路由系统，Babel 编译，webpack 打包。
后端，即 api server，使用 php 编写，数据库由 MySQLi 驱动。

## 近几次更新日志

### 0.3.0.beta1

1. Emoji 表情发送错误的问题，请切换 LandChat 数据库字符集为 utf8mb4；
2. 注册功能添加；
3. 首页样式改动；
4. KaTeX公式渲染支持。

### 0.3.0.dev5

1. 增加一些微互动；
2. Bug 修复。
>>>>>>> 0.3.0.beta1

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

### 之后更新预告:

1. 消息更新间隔缩短到 1s。
