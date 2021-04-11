#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var colors_1 = __importDefault(require("colors"));
var init_1 = __importDefault(require("./modules/init"));
var download = require('download-git-repo');
var unloadChar = '-';
var loadedChar = '=';
var downloadUrl = 'https://github.com:zhaodeezhu/xioo-csr#master';
var csrUrl = 'https://github.com:zhaodeezhu/xioo-csr#master';
var ssrUrl = 'https://github.com:zhaodeezhu/xioo-ssr#master';
commander_1.default.version('0.0.3', '-v, --version');
commander_1.default
    .command('init <projectName>')
    .option('-c, --csr', 'client side rendering')
    .option('-s, --ssr', 'server side rendering')
    .description('XIOO PROJECT INIT')
    .action(function (name, options, command) {
    if (options.csr) {
        console.log(colors_1.default.cyan('clone CSR project'));
        init_1.default(name, csrUrl);
    }
    else if (options.ssr) {
        console.log(colors_1.default.cyan('clone SSR project'));
        init_1.default(name, ssrUrl);
    }
    else {
        console.log('请输入正确的参数');
    }
});
commander_1.default.parse(process.argv);
