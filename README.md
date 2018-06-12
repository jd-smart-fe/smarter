# Smarter

![npm](https://img.shields.io/npm/v/smarter.svg?style=flat-square)

Smarter 是一个 CLI 流程工具，它提供多种方式来提升开发效率。

## 安装

```
$ npm i -g smarter
```

## 使用

### init: 生成脚手架

`smarter init <template> [project]` 用于快速搭建各类项目的脚手架。

e.g. 生成 React 同构直出模板

```bash
$ smarter init rephic my-project  # 生成脚手架到 my-project 目录下
```

**查看全部支持的脚手架:** `smarter init -h`

### mock: 本地 mock API 请求

`smarter mock` 用户在本地开发时 mock API 请求数据。

> 运行 `smarter mock` 命令时，若本地没有 smarter.mock.config.js 的配置文件，则会自动生成一份默认的配置文件在本地。

#### Configuration

- `smarter.mock.config.js`
- `smarter.mock.db.json`

##### smarter.mock.config.js

```javascript
module.exports = {
  //监听的端口号 默认3002 可选
  PORT: 3002,
  // 是否浏览器缓存
  nocache: false,
  // 配置静态资源文件夹
  static: ['./static'],
  // 替换url
  // 把 /baz/list/ url 替换成 /list
  // 如：请求的url为：http://localhost:3002/baz/list/ 替换成 http://localhost:3002/list
  rewrite: [{
    pattern: '/baz/list',
    responder: '/list',
  }, {
    pattern: '/foo',
    responder: '/echo',
  }],
  apis: {

    // path
    '/echo': {
      // METHOD
      GET: {
        code: 0,
        msg: 'success',
      },
      // post 设置 __REQ_QUERY__ 的时候 返回 GET 请求参数
      // 如请求：http://localhost:3002/echo?name=zs&sex=true 地址
      // 返回 {name: 'zs', sex: true}
      POST: '__REQ_QUERY__',
    },

    '/bye': {
      GET: {
        code: 0,
        data: [1, 2, 3],
      },
      POST: {
        code: 0,
        msg: 'response by post ',
      },
    },

  },
};

```

##### smarter.mock.db.json

```javascript
// 会根据此文件生成一个数据库支持增删改查、Restful、分页。
// 分页查询： http://localhost:3002/list?_page=1&_size=1
{
  "detail": {
    "id": 1,
    "title": "bala",
    "content": "Lorem ipsum dolor sit amet."
  },
  "list": [{
    "id": 1,
    "title": "bala"
  },{
    "id": 2,
    "title": "foo"
  }]
}

```

### upload: 本地文件上传到远程服务器

使用 `smarter upload [options]` 上传文件。
[options]:
- `-n, --name [value]` 配置文件里的某台服务器信息对象的变量名 默认为 `default`;
- `-c --config [value]` 配置文件的文件名字 默认是 `.uploadconfig`;

#### Configuration

上传本地文件到远程服务器时，需要在你的项目的根目录下准备一个 `.uploadconfig` 配置文件，文件的配置项可以像下面示例这样：
```
// .uploadconfig
module.exports.env_test = {
  host: '127.0.0.1',  // remote server
  port: 22,
  username: '...',
  password: '***',
  from: './dist',
  to: '/server/path'
}
```
命令行使用：
smarter upload -n env_test

### env 生成环境配置文件

`smarter env [option1 ... optionN]` 生成环境配置文件。

- `option` 可取的值:
  - `vscode` 生成 vscode 配置文件;
  - `editorconfig` 生成 editorconfig 配置文件;
  - `-r [rule] -i [installer] ` 生成 eslint 配置文件

### **-r [rule]**

根据项目环境不同来生成不同的 eslintrc 规则文件，rule 有以下可选项：

- `node` 或 `n`: 生成 nodejs 的 eslint 配置 （默认使用 node 配置）
- `vue` 或 `v`: 生成 vue 的 eslint 配置
- `react` 或 `r`: 生成 react 的 eslint 配置
- `browser` 或 `b`: 生成浏览器环境通用的 eslint 配置

### **-i [installer]**

根据项目包管理工具的不同来选择不同的包管理器来安装依赖，installer 有以下可选项：

- `npm`: 使用 npm 安装相关依赖（默认使用 npm）
- `yarn`: 使用 yarn 安装相关依赖
- `cnpm`: 使用 cnpm 安装相关依赖

example:
```bash
$ smarter env -r react -i npm # 生成 react 的 eslint 配置, 并使用 npm 来安装相关依赖
```

### **--no-plugins**

禁止自动安装 npm 相关依赖包，仅仅生成 `.eslintrc` 规则文件。

e.g.
```bash
smarter env vscode # 生成 vscode 配置文件
smarter env vscode editorconfig # 生成 vscode、 editorconfig 配置文件
smarter env -r r/react -i node # 生成 vscode、 editorconfig 配置文件
smarter env all # 生成 vscode、 editorconfig配置文件
```

## TODO

参考 [这里](https://github.com/jd-smart-fe/smarter/projects/1)
