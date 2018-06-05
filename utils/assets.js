const debug = require('debug')('smarter:utils');
const path = require('path');
const { gitClone, gitPull, isExist } = require('./utils');
const { ASSETS_ROPE, ASSETS_CACHE_DIR } = require('../config');

let updatedConfig = null;

/**
 * 获取 smarter-assets 库下的 init 相关配置文件内容
 *
 * @returns {Promise<any[]>}
 */

function getConfig() {
  // 在一次 cli 命令的生命周期内，只 pull 一次就够了。
  if (updatedConfig) {
    return Promise.resolve(updatedConfig);
  }

  return updateAssetsRepo()
    .then(() => readConfig())
    .then(config => {
      updatedConfig = config;
      return Promise.resolve(config);
    })
    .catch(e => {
      throw Error(e);
    });
}

/**
 * 更新或者克隆 smarter-assets 库
 *
 * @returns {Promise} 资源库更新完毕后 resolve
 */

function updateAssetsRepo() {
  return new Promise(resolve => {
    if (!isExist(ASSETS_CACHE_DIR)) {
      gitClone(ASSETS_ROPE, ASSETS_CACHE_DIR).then(() => resolve());
    } else {
      gitPull(ASSETS_CACHE_DIR)
        .then(() => resolve())
        .catch(() => resolve()); // git pull 执行失败并不影响用户查看 template list
    }
  });
}

function readConfig() {
  try {
    const config = require(path.join(ASSETS_CACHE_DIR, 'config'));
    debug('%s %o', 'readTemplatesConfig', config);
    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  getConfig,
  updateAssetsRepo,
};
