import program from 'commander';
import fly from './xiooprint';
import colors from 'colors';
const download = require('download-git-repo');
const downloadUrl = 'https://github.com:zhaodeezhu/xioo-csr#master';
const ora = require('ora');

export default (projectName, url) => {
  const spinner = ora('正在下载模板工程...').start();
  download(url, projectName, {clone: true}, err => {
    if(err) {
      spinner.fail('项目模板下载失败');
      console.log(err)
    } else {
      console.log(colors.green(fly))
      spinner.succeed('项目模板下载成功');
    }
  })
}
