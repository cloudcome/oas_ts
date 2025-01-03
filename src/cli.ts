import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Command } from 'commander';
import { generate, resolveConfigFile } from './command';
import { configFileBaseName, pkgName, pkgVersion } from './const';

export function createCLI() {
  const program = new Command();

  program
    .name(pkgName)
    .version(pkgVersion)
    .description(PKG_DESCRIPTION)
    .action((options, command) => {
      if (command.args.length === 0)
        return generate();

      program.help();
    });

  program
    .command('init')
    .description('初始化配置文件')
    .action(async () => {
      const configFile = resolveConfigFile(process.cwd());

      if (configFile) {
        console.log(`配置文件已存在`, path.relative(process.cwd(), configFile));
        return;
      }

      const configFilename = `${configFileBaseName}.cjs`;
      const configFilePath = path.join(process.cwd(), configFilename);

      fs.writeFileSync(
        configFilePath,
        `${`
const { defineConfig } = require('openapi-axios');

/**
 * openapi-axios config
 * @ref https://github.com/FrontEndDev-org/openapi-axios
 */
module.exports = defineConfig({
  modules: {
    'petStore3': 'https://petstore31.swagger.io/api/v31/openapi.json'
  },
});`.trim()}\n`,
      );
      console.log('生成配置文件', configFilename);
    });

  program.parse();
}
