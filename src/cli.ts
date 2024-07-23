import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { description } from '../package.json';
import { pkgName, pkgVersion } from './const';
import { resolveConfigFile, run } from './generators/command';

export function createCLI() {
    const program = new Command();

    program
        .name(pkgName)
        .version(pkgVersion)
        .description(description)
        .action((options, command) => {
            if (command.args.length === 0) return run();

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

            const configFilename = 'openapi.config.cjs';
            const configFilePath = path.join(process.cwd(), configFilename);

            fs.writeFileSync(
                configFilePath,
                `
const { defineConfig } = require('openapi-axios');

/**
 * openapi-axios config
 * @ref https://github.com/FrontEndDev-org/openapi-axios
 */
module.exports = defineConfig({
    modules: {
        'petStore3': 'https://petstore31.swagger.io/api/v31/openapi.json'
    },
});`.trim() + '\n',
            );
            console.log('生成配置文件', configFilename);
        });

    program.parse();
}
