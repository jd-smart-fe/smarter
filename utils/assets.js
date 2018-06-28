const debug = require('debug')('smarter:utils');
const path = require('path');
const { ensureFileSync, readFileSync, writeFileSync } = require('fs-extra');
const { gitClone, gitPull, isExist } = require('./utils');
const { ASSETS_ROPE, ASSETS_CACHE_DIR, CACHE_DIR } = require('../config');

const LAST_TIME_FILE = path.join(CACHE_DIR, '.cache', 'assets.json');

let updatedConfig = null;

/**
 * 获取 smarter-assets 库下的 init 相关配置文件内容
 *
 * @param {Boolean} cache Assets repository will not update again,
 *                        if have updated in recent days.
 * @returns {Promise<any[]>}
 */

exports.getConfig = async (cache = true) => {
  const cacheTime = 7 * 24 * 3600; // cache 7days.

  // 在一次 cli 命令的生命周期内，只 pull 一次就够了。
  if (updatedConfig) {
    return updatedConfig;
  }

  // no longer pull the repository, in the cache time
  if (cache &&
    Date.now() - lastUpdateTime() < cacheTime
  ) {
    return readConfig();
  }

  await exports.updateAssetsRepo();
  return readConfig();
}

/**
 * 更新或者克隆 smarter-assets 库
 *
 * @returns {Promise} 资源库更新完毕后 resolve
 */

exports.updateAssetsRepo = async (cache) => {
  saveUpdateTime();

  if (!isExist(ASSETS_CACHE_DIR)) {
    await gitClone(ASSETS_ROPE, ASSETS_CACHE_DIR);
    return;
  }
  await gitPull(ASSETS_CACHE_DIR);
}

/**
 * require config file in assets repository.
 */

function readConfig() {
  const config = require(path.join(ASSETS_CACHE_DIR, 'config'));
  debug('%s %o', 'readTemplatesConfig', config);
  return config;
}

/**
 * Save last update time for assets repository
 */

const saveUpdateTime = () => {
  let json;
  ensureFileSync(LAST_TIME_FILE);

  try {
    json = require(LAST_TIME_FILE);
  } catch (error) {
    json = {};
  }

  json.updateTime = Date.now();

  writeFileSync(LAST_TIME_FILE, JSON.stringify(json), { encoding: 'utf-8' });

  return json.updateTime;
};

/**
 * Check the last update time for assets repository
 *
 * @returns {Number} last update timestamp
 */

const lastUpdateTime = () => {
  let time = null;

  try {
    time = require(LAST_TIME_FILE).updateTime ;
  } catch (error) {
    time = 0;
  }

  return time;
}
