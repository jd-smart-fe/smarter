const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const { exec } = require('child_process');
const utils = require('./utils');
const { CACHE_DIR, TEMPLATE_CACHE_PATH, TEMPLATE_ROPES } = require('../config');

/**
 * 在目标目录下生成指定的项目模板
 *
 * @param {String} template   模板名称
 * @param {String} target     本地路径，绝对路径
 */
module.exports = (template, target) => new Promise(((resolve, reject) => {
  if (!utils.isExist(CACHE_DIR)) { // 用户本地是否存在 CACHE_DIR
    utils.mkdir(CACHE_DIR); // 不存在则初始化一个
  }

  // 本地是否存在存放模板的文件夹
  if (!utils.isExist(TEMPLATE_CACHE_PATH)) {
    // 不存在则初始化一个
    utils.mkdir(TEMPLATE_CACHE_PATH);
  }

  // 本地是否有模板文件的缓存
  const tamplatePath = path.resolve(TEMPLATE_CACHE_PATH, template);
  const repo = TEMPLATE_ROPES[template];

  // 模板没有被配置在 /config.js 文件中
  if (!repo) {
    reject(new Error(`The "${template}" template not found!`));
    return;
  }

  // 如果本地缓存没有对应的模板
  if (!utils.isExist(tamplatePath)) {
    utils.gitClone(repo, tamplatePath)
      .then(() => copyTemplate(tamplatePath, target))
      .then(() => resolve())
      .catch(e => reject(e));

    // 如果本地缓存中已有该模板
  } else {
    copyTemplate(tamplatePath, target)
      .then(() => resolve())
      .catch(e => reject(e));
  }
}));


/**
 * 将路径下的模板目录复制到目标路径
 *
 * @param {*} templatePath  本地模板的绝对路径
 * @param {*} target        目标路径
 */
function copyTemplate(templatePath, target) {
  // 必须要求是绝对路径
  if (!path.isAbsolute(target)) {
    throw new Error('It is not absolute path!');
  }

  return new Promise(((resolve, reject) => {
    if (!utils.isExist(templatePath)) {
      reject(new Error('Please pass in the correct template name!'));
    }

    utils.gitPull(templatePath)
      // 将整个目录复制过去
      .then(() => fs.copy(templatePath, target))
      .then(() => new Promise((_resolve, _reject) => {
        // 删除复制过去的 .git 文件夹
        fs.remove(path.resolve(target, '.git'), (err) => {
          if (err) return _reject(err);
          return _resolve();
        });
      }))
      .then(() => resolve())
      .catch(e => reject(e));
  }));
}
