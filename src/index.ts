import { Command, flags } from '@oclif/command';
import { Answers, prompt } from 'inquirer';
import { execSync } from 'child_process';
import fs from './helpers/fs';
import { availableConfigs, routerTypes } from './data/constants';
import deps from './data/dependencies';

class ReactCli extends Command {
  static description = 'Create a React app using NeoCoast\'s boilerplate';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  static args = [];

  async setupProject(cliRoot: string, answers: Answers) {
    let dependencies: string[] = deps.base.deps;
    let devDependencies: string[] = deps.base.devDeps;

    const projectName = answers.projectName;

    try {
      await fs.createDir(projectName);
      await fs.copyBaseFiles(cliRoot, projectName, answers.configs.includes('sass'));

      if (answers.preCommit) {
        devDependencies = devDependencies.concat(deps.preCommit.devDeps);
      }

      if (answers.configs.includes('eslint')) {
        devDependencies = devDependencies.concat(deps.eslint.devDeps);
        await fs.addEslint(cliRoot, projectName, answers.preCommit);
      }

      if (answers.configs.includes('stylelint')) {
        devDependencies = devDependencies.concat(deps.stylelint.devDeps);
        await fs.addStylelint(cliRoot, projectName, answers.preCommit, answers.configs.includes('sass'));
      }

      if (answers.configs.includes('axios')) {
        dependencies = dependencies.concat(deps.axios.deps);
        await fs.addAxios(cliRoot, projectName);
      }

      if (answers.configs.includes('reactRouter')) {
        dependencies = dependencies.concat(deps.router.deps);
        await fs.addRouter(cliRoot, projectName, answers.routerType, answers.configs.includes('sass'));
      }

      if (answers.configs.includes('redux') || answers.configs.includes('reduxSaga')) {
        dependencies = dependencies.concat(deps.redux.deps);
        await fs.addRedux(cliRoot, projectName);
      }

      if (answers.configs.includes('reduxSaga')) {
        dependencies = dependencies.concat(deps.reduxSagas.deps);
        devDependencies = devDependencies.concat(deps.reduxSagas.devDeps);
        await fs.addReduxSaga(cliRoot, projectName);
      }

      if (answers.configs.includes('sass')) {
        devDependencies = devDependencies.concat(deps.sass.devDeps);
        await fs.addSass(cliRoot, projectName);
      }

      await fs.updatePackageJson(answers);

      execSync(
        `cd ${projectName} &&
         git init &&
         npm install &&
         npm install --save ${dependencies.join(' ')} &&
         npm install --save-dev ${devDependencies.join(' ')}`,
        {
          stdio: 'inherit',
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async run() {
    this.parse(ReactCli);

    const answers: Answers = await prompt([
      {
        name: 'projectName',
        message: 'Project name:',
        type: 'input',
        required: true,
        validate: (value: string) => value.trim() !== '',
      },
      {
        name: 'description',
        message: 'Description',
        type: 'input',
      },
      {
        name: 'author',
        message: 'Author',
        type: 'input',
      },
      {
        name: 'license',
        message: 'License',
        type: 'input',
        default: 'MIT',
      },
      {
        name: 'owner',
        message: 'Who is the GitHub owner of repository(https://github.com/OWNER/repo)',
        type: 'input',
      },
      {
        name: 'repo',
        message: 'What is the GitHub name of repository(https://github.com/owner/REPO)',
        type: 'input',
      },
      {
        type: 'checkbox',
        name: 'configs',
        message: 'Pick your configurations',
        pageSize: availableConfigs.length,
        choices: availableConfigs,
      },
      {
        name: 'preCommit',
        message: 'Do you want to configure the linter as a pre-commit hook?',
        type: 'confirm',
        default: true,
        when: (answers: { configs: Array<string> }) => answers.configs.includes('eslint'),
      },
      {
        name: 'routerType',
        message: 'What router type do you want?',
        type: 'list',
        choices: routerTypes,
        when: (answers: { configs: Array<string> }) => answers.configs.includes('reactRouter'),
      },
    ]);

    await this.setupProject(this.config.root, answers);
  }
}

export = ReactCli

