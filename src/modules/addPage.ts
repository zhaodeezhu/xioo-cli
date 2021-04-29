import * as fs from 'fs';
import * as path from 'path';
import config from '../config';

import colors from 'colors';

const rootPath = process.cwd();

export default class FlyCli {

  constructor({ pageCode, moduleName, title }) {
    this.fileName = pageCode;
    this.dirPath = module ? `${config.rootPagePath}/${module}/${this.fileName}` : `${config.rootPagePath}/${this.fileName}`;
    this.moduleName = moduleName;
    this.title = title;
  }

  /** 程序名 */
  fileName: string;
  /** 路径 */
  dirPath: string;
  /** 模块名 */
  moduleName: string;
  /** 标题 */
  title: string;
  /** 添加模块 */
  addModule() {
    let fileName = this.fileName;
    let dirPath = this.moduleName ? `${config.rootPagePath}/${this.moduleName}/${fileName}` : `${config.rootPagePath}/${fileName}`
    let data = fs.readFileSync(path.join(__dirname, '../demo/.demo'), 'utf8');
    data = data.replace('{{ Demo }}', fileName)
    data = data.replace('{{class}}', fileName.toLowerCase())
    console.log(colors.blue(`You create module: `), fileName);
    let dirPathArr = dirPath.split('/');
    let dataPathStr = ''
    let flag = true
    for (let i = 0; i < dirPathArr.length; i++) {
      if (i === 0) {
        dataPathStr += dirPathArr[i]
      } else {
        dataPathStr += '/' + dirPathArr[i]
      }

      let statObj = fs.existsSync(dataPathStr)

      if (i === dirPathArr.length - 1 && statObj) {
        console.log(colors.red('【error!!!】' + dataPathStr + ' 模块名重复，请修改重新创建'))
        flag = false
        break;
      }

      if (!statObj) {
        fs.mkdirSync(`${dataPathStr}`)
      }
    }

    if (!flag) {
      return false
    }

    // 模块的目录
    const moduleDir = `${dirPath}`;
    // 判断是否存在
    let statObj = fs.existsSync(moduleDir);
    // 创建模块目录
    // fs.mkdirSync(moduleDir);
    // 创建constrollers
    const constrollersDir = `${moduleDir}/controllers`;
    fs.mkdirSync(constrollersDir);
    // 创建service目录
    const serviceDir = `${moduleDir}/service`;
    fs.mkdirSync(serviceDir);
    // 创建views目录
    const viewsDir = `${moduleDir}/views`;
    fs.mkdirSync(viewsDir);


    fs.writeFileSync(`${viewsDir}/${fileName}.tsx`, data);
    fs.writeFileSync(`${viewsDir}/index.less`, `.fly-${fileName.toLowerCase()} {}`);
    fs.writeFileSync(`${viewsDir}/index.ts`, `import ${fileName} from './${fileName}'\nexport default ${fileName}`);
    this.makeModuleIndex();
    console.log(colors.green(`【successful!!!】Module '${fileName}' is created, in ${dirPath}`))
    return true
  }
  // 三步走
  /** 判断模块是否存在 */
  isEsist(): boolean {
    let statFlag = fs.existsSync(path.join(rootPath, `app/pages/router/moduleRoutes/${this.moduleName}.ts`));
    return statFlag;
  }

  /** 生成模块文件 */
  makeModuleIndex() {
    if (this.isEsist()) {
      let fileData = fs.readFileSync(path.join(rootPath, `app/pages/router/moduleRoutes/${this.moduleName}.ts`), 'utf8');
      let fileDataArr = fileData.split('\n');
      // 引入模块处理
      let importIndex = fileDataArr.indexOf('export default {');
      // fileDataArr.splice(importIndex, 0, `const ${this.firstModuleNameUpper} = React.lazy(() => import('@/${this.moduleName}/${this.fileName}/views'));`);
      fileDataArr.splice(importIndex, 0, `import ${this.firstModuleNameUpper} from '@/${this.moduleName}/${this.fileName}/views';`);
      // 插入具体的路由处理
      let routerIndex = fileDataArr.length - 3;
      fileDataArr.splice(routerIndex, 1, '    },');
      let routerModule = `    {\n      path: '/index/${this.moduleName}/${this.fileName}',\n      Component: () => ${this.firstModuleNameUpper},\n      exact: true,\n      meta: {\n        title: '${this.title}',\n        show: true\n      }\n    }`
      fileDataArr.splice(routerIndex + 1, 0, routerModule);
      let data = fileDataArr.join('\n')
      // 将数据重新写回文件
      fs.writeFileSync(path.join(rootPath, `app/pages/router/moduleRoutes/${this.moduleName}.ts`), data)
    } else {
      let moduleIndexData = fs.readFileSync(path.join(__dirname, '../demo/.moduleIndex'), 'utf8');
      moduleIndexData = moduleIndexData.replace(/{{name}}/g, this.firstModuleNameUpper);
      moduleIndexData = moduleIndexData.replace(/{{path}}/, `${this.moduleName}/${this.fileName}`);
      moduleIndexData = moduleIndexData.replace(/{{base}}/, `${this.moduleName}`);
      moduleIndexData = moduleIndexData.replace(/{{router}}/, `${this.moduleName}/${this.fileName}`.toLocaleLowerCase());
      moduleIndexData = moduleIndexData.replace('{{title}}', this.title);
      // 创建路由表文件
      fs.writeFileSync(path.join(rootPath, `app/pages/router/moduleRoutes/${this.moduleName}.ts`), moduleIndexData);
      // 将文件引入到导出文件中
      this.willModuleIndex();
      // 改变路由文件
      this.explainInsertRoutes();
    }
  }

  /** 将新建的模块引入到导出文件中 */
  willModuleIndex() {
    // 读取文件
    let data = fs.readFileSync(path.join(rootPath, 'app/pages/router/moduleRoutes/index.ts'), 'utf8');
    // 获取import个数
    let importLength = data.match(/import/g).length;
    // 使用/n分割源文件
    let sourceFileArr = data.split('\n');
    sourceFileArr.splice(importLength, 0, `import ${this.moduleName} from './${this.moduleName}';`)
    let moduleIndex = sourceFileArr.indexOf('};');
    sourceFileArr.splice(moduleIndex - 1, 1, `${sourceFileArr[moduleIndex - 1]},`);
    sourceFileArr.splice(moduleIndex, 0, `  ${this.moduleName}`);
    let indexData = sourceFileArr.join('\n');
    fs.writeFileSync(path.join(rootPath, `app/pages/router/moduleRoutes/index.ts`), indexData);
  }

  /** 解析插入到路由表中 */
  explainInsertRoutes() {
    // 读取路由文件
    let data = fs.readFileSync(path.join(rootPath, 'app/pages/router/routes.ts'), 'utf8');
    // 解析要插入的位置
    let dataArrReverse = data.split('\n').reverse();

    let insertReverseIndex = dataArrReverse.findIndex((item: any) => {
      return item.indexOf('moduleRoutes') > -1;
    })
    let dataArr = dataArrReverse.reverse();
    let insertIndex = dataArrReverse.length - insertReverseIndex;
    dataArr.splice(insertIndex - 1, 1, `${dataArr[insertIndex - 1]},`);
    dataArr.splice(insertIndex, 0, `          ...(moduleRoutes.${this.moduleName}.routes && moduleRoutes.${this.moduleName}.routes.length > 0 ? moduleRoutes.${this.moduleName}.routes : [moduleRoutes.${this.moduleName}])`);
    fs.writeFileSync(path.join(rootPath, 'app/pages/router/routes.ts'), dataArr.join('\n'));
  }

  /** 将文件名首字母大写 */
  get firstModuleNameUpper() {
    let fileNameArr = this.fileName.split('')
    return fileNameArr[0].toUpperCase() + fileNameArr.slice(1, fileNameArr.length).join('')
  }
}