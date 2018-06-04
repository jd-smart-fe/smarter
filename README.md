# Smarter

![npm](https://img.shields.io/npm/v/smarter.svg?style=flat-square)

Smarter 是一个 CLI 工具，它提供多种方式来提升开发效率。

## Install

```
$ npm i -g smarter
```

## Usage

### 生成脚手架

使用 `smarter init <template> [project]` 来快速生成各类的脚手架。如：

生成 React 同构直出模板
```bash
$ smarter init rephic my-project  # 生成脚手架到 my-project 目录下
```

使用 `smarter init -h` 来查看全部的脚手架列表。

### mock

使用 `smarter mock` 来启动

#### smarter.mock.config

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
#### smarter.mock.db.json
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

### 本地文件上传到远程服务器

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


## TODO

参考 [这里](https://github.com/jd-smart-fe/smarter/projects/1)
