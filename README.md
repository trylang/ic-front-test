# 创新中心 2017-7-30

## 配置环境

- **Nodejs/npm** 基础开发环境
- **Git** 版本控制
- **Filezilla** 文件传输工具(主要用于将文件传输到开发或生产服务器)
- **Meld** (代码比较合并工具， 也可以选择Beyond Compare)
- **Visual Studio Code** 开发工具
- **OpenVPN** (Windows and Linux) OR **Tunnelblick** (MacOS) Gitlab服务器VPN工具

```markdown
OpenVPN Windows Configure
1. 安装openvpn，拷贝config目录到安装目录
2. 配置Openvpn启动程序，设置兼容性为通过管理员运行(windowOS, 右单击-以管理员身份运行)
3. 连接openvpn，输入用户名密码: guestHZ/Letmein123
4. 访问Gitlab服务 http://10.46.215.20/users/sign_in (本次开发项目是ark/ic-front)
5. 配置ssh-key
6. 相关配置完成后，即可克隆代码到本地
```

## How to use

> Before cloning code, you should connected to Gitlab OpenVPN.

### 1. Clone code

```bash
git clone git@10.46.215.20:ark/ic-front.git -b dev
```

### 2. Installition

```bash
npm install
```

### 3. Start a local server

```bash
npm run start
```

- Build code

```bash
npm run build
```

- Auto Unit-Testing

```bash
npm run test
```

- Auto E2E-Testing

```bash
npm run e2e
```

## Git使用指南

### 添加180Gitlab remote

```bash
git remote add gitlab git@192.168.1.180:ark-group/ic-front.git

# on dev branch
git pull gitlab dev --allow-unrelated-histories

git push gitlab dev
```

## 技术概览

- 语言 **Typescript** [中文网](https://www.tslang.cn/) [英文网](http://www.typescriptlang.org/)
- JS框架(平台) **Anguar@^4.3.2** [中文官网](https://angular.cn/) [英文官网](https://angular.io/)
- HTML/CSS模板 **[Bootstrap@^3.3.7](http://getbootstrap.com/components/)**
- 图标字体 **[FontAwesome](http://fontawesome.io/icons/)**
- Unit-Testing **Karma + Jasmine**
- E2E-Testing **karma + Practor**
- 函数库 **[Lodash](https://lodash.com/docs/)**
- CSS预处理器 **[SASS](http://sass.bootcss.com/)**
- 打包构建工具 **weback** [中文文档](https://doc.webpack-china.org/) [英文官网](https://webpack.js.org/)
- 版本控制 **Git**
- 托管Git项目仓库 **Gitlab** [http://10.46.215.20/](http://10.46.215.20/)
- 项目管理软件 **禅道** [http://36.110.36.118:1980/](http://36.110.36.118:1980/)
- 普奥知识分享平台及API文档 **Wiki** [http://114.215.222.181/](http://114.215.222.181/)

## 开发规范

### 集成自动化规范

- TSLint
- HTMLHint
- Sass Lint
- ESLint

### 一些推荐编程规范

- [Angular官方规范](https://angular.io/guide/styleguide)
- [Angular: Best Practices](https://codeburst.io/angular-best-practices-4bed7ae1d0b7)
- [Angular: Bad Practices](https://codeburst.io/angular-bad-practices-eab0e594ce92)
- [Airbnb Css Styleguide](https://github.com/airbnb/css)
- [CssGuide](https://cssguidelin.es/)

## 一些优化计划列表

- 路由守卫
- 统一接口请求
- H5语义代码片段
- 路由过渡动画
- 删除垃圾代码
- 时常重构

## 组建化列表

- ECharts 折线图（多个以及单个），柱状图（多个以及单个），地图，饼图
- D3 拓扑图，关系图
- table列表
- 百度地图画圈
- Validate
- 头部用户基本信息

## Visual Studio Code 常用插件@sort:installs

- vscode-icons
- Debugger for Chrome
- ESLint
- Beautify
- TSLint
- HTML Snippets
- Angular v4 TypeScript Snippets
- IntelliSense for Css class names
- npm
- Path Intellisense
- Document This
- Bootstrap 3 Snippets
- Angular 2+ Snippets
- Sass
- Prettier - JavaScript formatter
- HtmlHint
- Color Highlight
- Angular 2 TypeScript Emmet
- Sass Lint

## 常用代码片段

### 1. sweetalert2

```ts
swal({
      title: '您确定要删除吗？',
      text: '该操作将彻底删除，并且不能恢复!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#673ab7',
      cancelButtonColor: '#dc3545',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        // do action confirm
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          // do antion cancel
        }
      }
    );
```

## 更新日志

### Sprint2（2017/08/29 - 2017/09/15）

- 供应商搜索、详情
- 产品搜索、详情
- 园区搜索、详情、地图
- 管理中心
  - 管理员 用户管理，列表管理
  - 研究员 列表，编辑（重改了Sprint1的列表模块）

### Sprint1 （2017/08/10 - 2017/08/28）

- 基本框架
- 登录注册
- 研究员 列表、编辑
- 首页
- 方案搜索、详情
