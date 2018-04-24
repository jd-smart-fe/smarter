const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

exports.isExist = (filepath) => {
  try {
    fs.accessSync(filepath);
    return true;
  } catch (e) {
    return false;
  }
};


exports.mkdir = (dir) => {
  try {
    fs.mkdirSync(dir);
    return true;
  } catch (e) {
    return false;
  }
};


exports.gitClone = (repo, target) => {
  const url = `https://github.com/${repo}.git`;
  return new Promise((resolve, reject) => {
    exec(`git clone ${url} ${target}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject();
      }
      resolve();
    });
  });
};


exports.gitPull = (targetPath) => {
  const cmd = `git --git-dir=${path.join(targetPath, '.git')} --work-tree=${targetPath} pull`;

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
