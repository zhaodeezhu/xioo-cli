"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flyc_1 = __importDefault(require("./flyc"));
var colors_1 = __importDefault(require("colors"));
var download = require('download-git-repo');
var downloadUrl = 'https://github.com:zhaodeezhu/fly#master';
var ora = require('ora');
exports.default = (function (projectName) {
    var spinner = ora('正在下载模板工程...').start();
    download(downloadUrl, projectName, { clone: true }, function (err) {
        if (err) {
            spinner.fail('项目模板下载失败');
        }
        else {
            console.log(colors_1.default.green(flyc_1.default));
            spinner.succeed('项目模板下载成功');
        }
    });
});
