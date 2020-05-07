import program from 'commander';
import fly from './flyc';
import colors from 'colors';
const download = require('download-git-repo');
const downloadUrl = 'https://github.com:zhaodeezhu/fly#master';
const ora = require('ora');

export default (projectName) => {
  const spinner = ora('正在下载模板工程...').start();
  download(downloadUrl, projectName, {clone: true}, err => {
    if(err) {
      spinner.fail('项目模板下载失败');
    } else {
      console.log(colors.green(fly))
      spinner.succeed('项目模板下载成功');
    }
  })
}
