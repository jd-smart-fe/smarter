#!/usr/bin/env node

const program = require('commander');
const karrier = require('karrier');
const path = require('path');
const fs = require('fs');

program
  .usage('[options]')
  .option('-n, --name [value]', 'Config name that is defined in .uploadconfig', 'default')
  .option('-c, --config [value]', 'The name of the smarter upload config file', '.uploadconfig')
  .parse(process.argv);

(() => {
  console.log(path.resolve(process.cwd()), __dirname);
  if (!fs.existsSync(path.resolve(process.cwd(), program.config))) {
    console.error(`Error:  Can not found the ${program.config} file in the ${process.cwd()} directory`);
    console.log(`        You need create a ${program.config} file like this:`);
    console.log();
    console.log(`        // ${program.config}`);
    console.log('        module.exports.env_test = {');
    console.log('          host: "192.168.1.1"  // Remote server');
    console.log('          port: 22 // SSH port');
    console.log('          username: "xxx"');
    console.log('          password: "***"');
    console.log('          from: "local path"  // Location of the local directory');
    console.log('          to: "remote path"  // Remote directory');
    console.log('        }');
    process.exit(1);
  };
  const file = require(path.resolve(process.cwd(), program.config));
  const env_name = program.name;
  const config = file[env_name];

  if (!config) {
    console.error(`Error:  ${env_name} is not defined or null in the ${program.config} file`);
    process.exit(1);
  }

  if(Object.keys(config).length == 0) {
    console.error('Error:  missing config item.');
    process.exit(1);
  }

  console.log(config);

  karrier(config);
})();
