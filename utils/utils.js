const debug = require('debug')('smarter:uitls');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

exports.isExist = filepath => {
  try {
    fs.accessSync(filepath);
    debug('%s', `${filepath} existed`);
    return true;
  } catch (e) {
    debug('%s', `${filepath} not exist`);
    return false;
  }
};

exports.mkdir = dir => {
  try {
    fs.mkdirSync(dir);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * git clone [repo] [target]
 *
 * @param {string} git 要 clone 的 git 库地址
 * @param {string} target clone 到目标文件夹 target
 * @returns {Promise<void>}
 */

exports.gitClone = (git, target = '') => new Promise((resolve, reject) => {
  exec(`git clone ${git} ${target}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      reject();
    }
    debug('%s', 'clone done!');
    resolve();
  });
});

/**
 * git pull
 *
 * @param {string} targetPath git 库的根目录
 * @returns {Promise<void>}
 */

exports.gitPull = targetPath => {
  const cmd = `git --git-dir=${path.join(
    targetPath,
    '.git',
  )} --work-tree=${targetPath} pull`;

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
