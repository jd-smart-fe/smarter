const debug = require('debug')('smarter:generator');
const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils');
const assets = require('./assets');
const { CACHE_DIR } = require('../config');

/**
 * 在目标目录下生成指定的项目模板
 *
 * @param {string} template   模板名称
 * @param {string} target     本地路径，绝对路径
 * @returns {Promise}
 */

module.exports = (template, target) => {
  const TEMPLATE_CACHE_PATH = path.join(CACHE_DIR, 'templates');

  return new Promise((resolve, reject) => {
    // 本地是否存在存放模板的文件夹，不存在则初始化一个
    fs.mkdirsSync(TEMPLATE_CACHE_PATH);

    // 本地脚手架的缓存目录
    const templatePath = path.resolve(TEMPLATE_CACHE_PATH, template);

    assets
      // 从 smarter-assets 库中获取 templates 相关配置
      .getConfig()
      // 从配置中找到正确的配置项
      .then(config => {
        let git = null;
        config.templates.forEach(item => {
          if (git) return;
          if (item.name === template) {
            git = item.git;
          }
        });

        debug('%s %o', 'find template git', git);

        if (git) {
          return Promise.resolve(git);
        }
        return Promise.reject(Error(`The "${template}" template not found!`));
      })
      // 生成模板
      .then(git => toGenerate({ git, templatePath, target }))
      .then(() => resolve())
      .catch(e => reject(Error(e)));
  });
};

/**
 * 生成模板
 *
 * @param {object} option
 * @param {string} [option.git]           git 库地址
 * @param {string} [option.templatePath]  本地模板缓存地址
 * @param {string} [option.target]        生成模板的目标路径
 */
function toGenerate({ git, templatePath, target }) {
  debug('%s', 'to genterate');
  return new Promise((resolve, reject) => {
    // 如果本地缓存没有对应的模板
    if (!utils.isExist(templatePath)) {
      utils
        .gitClone(git, templatePath)
        .then(() => copyTemplate(templatePath, target))
        .then(() => resolve())
        .catch(e => reject(e));
      // 如果本地缓存中已有该模板
    } else {
      copyTemplate(templatePath, target)
        .then(() => resolve())
        .catch(e => reject(e));
    }
  });
}

/**
 * 将路径下的模板目录复制到目标路径
 *
 * @param {string} templatePath  本地模板的绝对路径
 * @param {string} target        目标路径
 * @returns {Promise}
 */

function copyTemplate(templatePath, target) {
  debug('%s %o', 'templatePath:', templatePath);
  // 必须要求是绝对路径
  if (!path.isAbsolute(target)) {
    throw new Error('It is not absolute path!');
  }

  return new Promise((resolve, reject) => {
    if (!utils.isExist(templatePath)) {
      reject(new Error('Please pass in the correct template name!'));
    }

    utils
      .gitPull(templatePath)
      // 将整个目录复制过去
      .then(() => fs.copy(templatePath, target))
      .then(() => new Promise((_resolve, _reject) => {
        // 删除复制过去的 .git 文件夹
        fs.remove(path.resolve(target, '.git'), err => {
          if (err) return _reject(err);
          return _resolve();
        });
      }))
      .then(() => resolve())
      .catch(e => reject(e));
  });
}
