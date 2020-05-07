#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var init_1 = __importDefault(require("./modules/init"));
var download = require('download-git-repo');
var unloadChar = '-';
var loadedChar = '=';
var downloadUrl = 'https://github.com:zhaodeezhu/fly#master';
commander_1.default.version('0.0.1', '-v, --version');
commander_1.default
    .command('init <projectName>')
    .description('初始化项目模板')
    .action(function (projectName) {
    init_1.default(projectName);
});
commander_1.default.parse(process.argv);
