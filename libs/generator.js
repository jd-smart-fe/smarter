var path = require('path');
var fs = require('fs-extra')
var os = require('os');
var exec = require('child_process').exec;
var utils = require('./utils');
var { CACHE_DIR, TEMPLATE_CACHE_PATH, TEMPLATE_ROPES } = require('../config');

/**
 *
 * @param {String} template 模板名称
 * @param {String} target 本地路径，绝对路径
 */
var generator = function (template, target) {
  return new Promise(function (resolve, reject) {

    if (!utils.isExist(CACHE_DIR)) {   // 用户本地是否存在 CACHE_DIR
      utils.mkdir(CACHE_DIR);   // 不存在则初始化一个
    }

    // 本地是否存在存放模板的文件夹
    if (!utils.isExist(TEMPLATE_CACHE_PATH)) {
      // 不存在则初始化一个
      utils.mkdir(TEMPLATE_CACHE_PATH);
    }

    // 本地是否有模板文件的缓存
    var tamplatePath = path.resolve(TEMPLATE_CACHE_PATH, template);
    var repo = TEMPLATE_ROPES[template];

    if (!repo) {
      reject(`The "${template}" template not found!`);
      return;
    }

    if (!utils.isExist(tamplatePath)) {
      utils.gitClone(repo, tamplatePath)
        .then(() => copyTemplate(template, target))
        .then(() => resolve())
        .catch(e => reject(e));

    } else {
      copyTemplate(tamplatePath, target)
        .then(() => resolve())
        .catch(e => reject(e));
    }
  });
};


function copyTemplate(templatePath, target) {

  if (!path.isAbsolute(target)) {
    throw new Error('It is not absolute path!');
  }

  return new Promise(function (resolve, reject) {

    if (!utils.isExist(templatePath)) {
      reject(`Please pass in the correct template name!`);
    }

    utils.gitPull(templatePath)
      .then(() => fs.copy(templatePath, target))
      .then(() => new Promise((resolve, reject) => {
        fs.remove(path.resolve(target, '.git'), err => {
          if (err) return reject(err);
          resolve();
        });
      }))
      .then(() => resolve())
      .catch(e => reject(e))
  });
}




module.exports = generator;
