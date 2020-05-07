#!/usr/bin/env node
// import * as path from 'path';
// import * as fs from 'fs';
// console.log(__dirname);
// console.log(process.cwd());

import ShellQuestion = require('cover-shell-question');

import program from 'commander'

// const program = require('commander');
import * as readline from 'readline'
import colors from 'colors';
import init from './modules/init';
const download = require('download-git-repo');

const unloadChar='-';
const loadedChar='=';

const downloadUrl = 'https://github.com:zhaodeezhu/fly#master';

program.version('0.0.1', '-v, --version');


program
  .command('init <projectName>')
  .description('初始化项目模板')
  .action((projectName) => {
    init(projectName);
  })

program.parse(process.argv);



// const rl=readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });


// rl.question('你想对谁说声hello？ ',answer=>{
//   let i = 0;
//   let time = setInterval(()=>{
//       if(i>10){
//           clearInterval(time);
//           readline.cursorTo(process.stdout, 4, 2);
//           // readline.clearScreenDown(process.stdout);
//           console.log(`hello ${answer}`);
//           process.exit(0)
//           return
//       }
//       readline.cursorTo(process.stdout,0,1);
//       readline.clearScreenDown(process.stdout);
//       renderProgress('saying hello',i);
//       i++
//   },200);
// });

// function renderProgress(text,step){
//   const PERCENT = Math.round(step*10);
//   const COUNT = 2;
//   const unloadStr = new Array(COUNT*(10-step)).fill(unloadChar).join('');
//   const loadedStr = new Array(COUNT*(step)).fill(loadedChar).join('');
//   process.stdout.write(`${text}:【${colors.red.bgRed(loadedStr)}${colors.blue.bgBlue(unloadStr)}|${PERCENT}%】`)
// }
