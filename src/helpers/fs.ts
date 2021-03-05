import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { Answers } from 'inquirer';
import * as constants from '../data/constants';
import { PackageJSON } from '../interfaces/package-json.interface';

// Utility functions
const filterFunction = (src: string, dst: string, withSass: boolean): boolean => {
  if (path.extname(src) === '.css' && withSass) {
    return false;
  }

  if (path.extname(src) === '.scss' && !withSass) {
    return false;
  }

  return true;
}

const pathExists = async (dirPath: string, customMessage = ''): Promise<void> => {
  if (fs.existsSync(dirPath))
    return;

  throw new Error(customMessage || `Path: ${dirPath} does not exists 😔`);
};

const readPackageJson = async (projectName: string): Promise<PackageJSON> => {
  await pathExists(path.basename(projectName));
  await pathExists(path.join(path.basename(projectName), 'package.json'));

  const pathTo = path.join(path.basename(projectName), 'package.json');
  return fs.readJSON(pathTo);
};

const writePackageJson = async (projectName: string, data: PackageJSON): Promise<void> => {
  await pathExists(path.basename(projectName));
  await pathExists(path.join(path.basename(projectName), 'package.json'));

  const pathTo = path.join(path.basename(projectName), 'package.json');
  await fs.writeJson(pathTo, data, { spaces: 2 });
};

// Exported functions
const createDir = async (projectName: string): Promise<void> => {
  try {
    await fs.mkdir(projectName);
  } catch (error) {
    throw new Error(`Problem while creating dir: ${projectName}`);
  }
};

const copyBaseFiles = async (cliRoot: string, projectName: string, withSass: boolean): Promise<void> => {
  await pathExists(path.basename(projectName));

  const baseDir = path.join(cliRoot, 'src/templates/base');
  await fs.copy(baseDir, path.basename(projectName), { filter: (src: string, dst: string) => filterFunction(src, dst, withSass) });

  // Put project name on html title
  const pathToIndexFile = path.join(path.basename(projectName), '/public/index.html');
  let html = await fs.readFile(pathToIndexFile, 'utf8');
  html = html.replace(
    '<title></title>',
    `<title>${projectName}</title>`
  );
  await fs.writeFile(pathToIndexFile, html);
};

const updatePackageJson = async (answers: Answers) => {
  const packageJson = await readPackageJson(answers.projectName)

  packageJson.name = answers.projectName;
  packageJson.description = answers.description || '';
  packageJson.author = answers.author;

  if (answers.owner && answers.repo) {
    const url = `https://github.com/${answers.owner}/${answers.repo}`;
    packageJson.repository = {
      type: 'git',
      url: `git+${url}.git`,
    };

    packageJson.bugs = { url: `${url}/issues` };
    packageJson.homepage = url;
  }

  await writePackageJson(answers.projectName, packageJson)
}

const addAxios = async (cliRoot: string, projectName: string): Promise<void> => {
  const axiosDir = path.join(cliRoot, 'src/templates/axios');
  await fs.copy(axiosDir, path.join(path.basename(projectName), 'src'));
};

const addEslint = async (cliRoot: string, projectName: string, withPreCommit: boolean): Promise<void> => {
  const packageJson = await readPackageJson(projectName)

  // Add lint script and eslint dependencies
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: 'eslint ./ --ignore-pattern .gitignore --ignore-pattern dist --ext js,jsx .',
  };

  if (withPreCommit) {
    packageJson.husky = {
      hooks: {
        'pre-commit': 'npm run lint',
      },
    };
  }

  await writePackageJson(projectName, packageJson)

  // Add .eslintrc to the project
  const eslintDir = path.join(cliRoot, 'src/templates/eslint')
  await fs.copy(eslintDir, path.basename(projectName))
}

const addRouter = async (cliRoot: string, projectName: string, routerType: string, withSass: boolean): Promise<void> => {
  const routerDir = path.join(cliRoot, 'src/templates/router');
  await fs.copy(
    routerDir,
    path.basename(projectName),
    { overwrite: true, filter: (src: string, dst: string) => filterFunction(src, dst, withSass) },
  );

  // Router base config is browser router
  // If routerType is not browser, change it
  if (routerType !== 'browserRouter') {
    const pathToIndexFile = path.join(path.basename(projectName), '/src/containers/App/index.jsx');
    let indexFile = await fs.readFile(pathToIndexFile, 'utf8');
    indexFile = indexFile.replace(
      `${constants.routerTypes[0].moduleName}`,
      (constants.routerTypes.find(({ value }) => value === routerType) || {}).moduleName || ''
    );
    await fs.writeFile(pathToIndexFile, indexFile);
  }
};

const addRedux = async (cliRoot: string, projectName: string): Promise<void> => {
  const reduxDir = path.join(cliRoot, 'src/templates/redux');
  await fs.copy(
    reduxDir,
    path.basename(projectName),
    { overwrite: true },
  );
};

const addReduxSaga = async (cliRoot: string, projectName: string): Promise<void> => {
  const reduxSagaDir = path.join(cliRoot, 'src/templates/redux-saga');
  await fs.copy(
    reduxSagaDir,
    path.basename(projectName),
    { overwrite: true },
  );
};

const addStylelint = async (cliRoot: string, projectName: string, withPreCommit: boolean, withSass: boolean): Promise<void> => {
  const packageJson = await readPackageJson(projectName)

  // Add lint script and eslint dependencies
  packageJson.scripts = {
    ...packageJson.scripts,
    stylelint: `stylelint '**/*.${withSass ? 's' : ''}css'`,
  };

  if (withPreCommit) {
    packageJson.husky = {
      hooks: {
        'pre-commit': packageJson.husky?.hooks?.['pre-commit'] ?
          `${packageJson.husky.hooks['pre-commit']} && npm run stylelint` :
          'npm run stylelint',
      },
    };
  }

  await writePackageJson(projectName, packageJson);

  // Add .eslintrc to the project
  const stylelintDir = path.join(cliRoot, 'src/templates/stylelint')
  await fs.copy(stylelintDir, path.basename(projectName))
}

const addSass = async (cliRoot: string, projectName: string): Promise<void> => {
  const sassDir = path.join(cliRoot, 'src/templates/sass');

  await fs.copy(
    sassDir,
    path.basename(projectName),
    { overwrite: true },
  );

  // Replace css imports to scss imports on all jsx files
  glob(path.join(path.basename(projectName), 'src/**/*.jsx'), {}, (er, files) => {
    for (let index = 0; index < files.length; index++) {
      let f = fs.readFileSync(files[index], 'utf8');
      f = f.replace('.css', '.scss');
      fs.writeFileSync(files[index], f);
    }
  })
};

export default {
  createDir,
  copyBaseFiles,
  updatePackageJson,
  addAxios,
  addEslint,
  addRouter,
  addRedux,
  addReduxSaga,
  addStylelint,
  addSass,
};
