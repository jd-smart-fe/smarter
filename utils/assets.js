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

exports.getConfig = async () => {
  // 在一次 cli 命令的生命周期内，只 pull 一次就够了。
  if (updatedConfig) {
    return updatedConfig;
  }
  await exports.updateAssetsRepo();

  return readConfig();
}

/**
 * 更新或者克隆 smarter-assets 库
 *
 * @returns {Promise} 资源库更新完毕后 resolve
 */

exports.updateAssetsRepo = async () => {
  if (!isExist(ASSETS_CACHE_DIR)) {
    await gitClone(ASSETS_ROPE, ASSETS_CACHE_DIR);
    return;
  }
  await gitPull(ASSETS_CACHE_DIR)
}

function readConfig() {
  const config = require(path.join(ASSETS_CACHE_DIR, 'config'));
  debug('%s %o', 'readTemplatesConfig', config);
  return config;
}
