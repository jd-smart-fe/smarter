const debug = require('debug')('smarter:utils');
const path = require('path');
const { gitClone, gitPull, isExist } = require('./utils');
const { ASSETS_ROPE, CACHE_DIR } = require('../config');

const ASSETS_DIR = path.join(CACHE_DIR, 'assets');

let templatesConfig = null;

/**
 * 获取 smarter-assets 库下的 init 相关配置文件内容
 *
 * @returns {Promise<any[]>}
 */

function getTemplatesConfig() {
  if (templatesConfig) {
    return Promise.resolve(templatesConfig);
  }

  return cloneAssetsRepo()
    .then(() => readTemplatesConfig())
    .then(templateListConfig => {
      templatesConfig = templateListConfig;
      return Promise.resolve(templatesConfig);
    })
    .catch(e => {
      throw Error(e);
    });
}

function cloneAssetsRepo() {
  return new Promise(resolve => {
    if (!isExist(ASSETS_DIR)) {
      gitClone(ASSETS_ROPE, ASSETS_DIR).then(() => resolve());
    } else {
      gitPull(ASSETS_DIR)
        .then(() => resolve())
        .catch(() => resolve()); // git pull 执行失败并不影响用户查看 template list
    }
  });
}

function readTemplatesConfig() {
  try {
    const templateListConfig = require(path.join(ASSETS_DIR, 'config')).templates;
    debug('%s %o', 'readTemplatesConfig', templateListConfig);
    return Promise.resolve(templateListConfig);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  getTemplatesConfig,
};
