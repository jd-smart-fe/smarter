const path = require('path');
const os = require('os');

// 本地的缓存文件夹
exports.CACHE_DIR = path.resolve(os.homedir(), '.smarter');

// 将会去这个 git 库中读取 smarter 相关资源和配置
exports.ASSETS_ROPE = 'https://github.com/jd-smart-fe/smarter-assets.git';
