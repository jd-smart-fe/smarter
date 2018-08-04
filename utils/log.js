
const chalk = require('chalk');

exports.error = (...str) => {
  console.log(chalk.red(`[smarter]: ${str.join(' ')}`));
};

exports.warn = (...str) => {
  console.log(chalk.yellow(`[smarter]: ${str.join(' ')}`));
};

exports.log = (...str) => {
  console.log(`[smarter]: ${str.join(' ')}`);
};

exports.success = (...str) => {
  console.log(chalk.green`[smarter]: ${str.join(' ')}`);
};
