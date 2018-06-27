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

module.exports = async function generator(template, target) {
  const TEMPLATE_CACHE_PATH = path.join(CACHE_DIR, 'templates');

  // 本地是否存在存放模板的文件夹，不存在则初始化一个
  fs.mkdirsSync(TEMPLATE_CACHE_PATH);

  // 本地脚手架的缓存目录
  const templatePath = path.resolve(TEMPLATE_CACHE_PATH, template);
  const config = await assets.getConfig();

  let git = null;
  config.templates.forEach(item => {
    if (git) return;
    if (item.name === template) {
      git = item.git;
    }
  });

  debug('%s %o', 'find template git', git);

  if (!git) {
    throw new Error(`The "${template}" template not found!`);
  }

  await toGenerate({ git, templatePath, target });
};

/**
 * 生成模板
 *
 * @param {object} option
 * @param {string} [option.git]           git 库地址
 * @param {string} [option.templatePath]  本地模板缓存地址
 * @param {string} [option.target]        生成模板的目标路径
 */

async function toGenerate({ git, templatePath, target }) {
  debug('%s', 'to genterate');

  // 如果本地缓存没有对应的模板
  if (!utils.isExist(templatePath)) {
    await utils.gitClone(git, templatePath);
    await copyTemplate(templatePath, target);
    return;
  }

  // 如果本地缓存中已有该模板
  await copyTemplate(templatePath, target);
}

/**
 * 将路径下的模板目录复制到目标路径
 *
 * @param {string} templatePath  本地模板的绝对路径
 * @param {string} target        目标路径
 * @returns {Promise}
 */

async function copyTemplate(templatePath, target) {
  debug('%s %o', 'templatePath:', templatePath);
  // 必须要求是绝对路径
  if (!path.isAbsolute(target)) {
    throw new Error('It is not absolute path!');
  }

  if (!utils.isExist(templatePath)) {
    throw new Error('Please pass in the correct template name!');
  }

  await utils.gitPull(templatePath);
  await fs.copy(templatePath, target);
  await new Promise((resolve, reject) => {
    // 删除复制过去的 .git 文件夹
    fs.remove(path.resolve(target, '.git'), err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}
