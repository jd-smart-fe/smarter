
const chalk = require('chalk');

exports.error = str => {
  console.log(chalk.red(str));
};

exports.warn = str => {
  console.log(chalk.yellow(str));
};

exports.log = str => {
  console.log(str);
};
