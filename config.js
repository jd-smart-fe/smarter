const path = require('path');
const os = require('os');

// 本地的缓存文件夹
exports.CACHE_DIR = path.resolve(os.homedir(), '.smarter');

// 缓存文件夹下的模板目录
exports.TEMPLATE_CACHE_PATH = path.resolve(exports.CACHE_DIR, 'templates');

// 项目脚手架的 git 库
exports.TEMPLATE_ROPES = {
  'react-isomorphic': 'pspgbhu/react-isomorphic',
  'koa-template-ts': 'jd-smart-fe/koa-template-ts',
};
