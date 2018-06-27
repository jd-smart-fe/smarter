const debug = require('debug')('smarter:uitls');
const path = require('path');
const fs = require('fs');
const os = require('os');
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

exports.gitClone = async (git, target = '') => {
  await new Promise((resolve, reject) => {
    exec(`git clone ${git} ${target}`, (err, stdout, stderr) => {
      if (err) {
        reject(Error(err));
      }
      debug('%s', 'clone done!');
      resolve();
    });
  });
}

/**
 * git pull
 *
 * @param {string} targetPath git 库的根目录
 * @returns {Promise<void>}
 */

exports.gitPull = async targetPath => {
  const cmd = `git --git-dir=${path.join(
    targetPath,
    '.git',
  )} --work-tree=${targetPath} pull`;

  await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

/**
 * 私有方法
 * @param {Array} arr 路径分割的数组
 */
const _parentsRecursive = arr => {
  if (arr.length === 0) {
    return null;
  }
  const dirs = fs.readdirSync(_getFilePath(arr));
  const isProject = dirs.some(dir => dir === '.git' || dir === 'package.json');
  const name = arr.pop();
  if (!isProject) {
    return _parentsRecursive(arr);
  }

  return `${_getFilePath(arr)}${name}`;
};

/**
 * 私有方法
 * 获取文件的完整路径，兼容windows平台
 * @param {Array} arr
 */
const _getFilePath = (arr) => {
  if(os.platform() === 'win32'){
    return `${arr.join(path.sep)}${path.sep}`;
  }
  return `${path.sep}${arr.join(path.sep)}${path.sep}`;
}


/**
 * 获取项目路径
 */
exports.getProjectRootPath = () => {
  const basePath = process.cwd();
  const arr = basePath.split(path.sep).filter(item => {
    if (item !== '') {
      return item;
    }
    return false;
  });
  const projectRootPath = _parentsRecursive(arr);
  if (projectRootPath) {
    return projectRootPath;
  }
  return basePath;
};
