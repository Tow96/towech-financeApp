import { ProjectConfiguration, Tree, readProjectConfiguration, updateJson } from '@nx/devkit';
import * as path from 'path';

export const getProjectConfig = (
  tree: Tree,
  name: string,
  directory?: string
): { config: ProjectConfiguration; newName: string; fullName: string[] } => {
  const config = readProjectConfiguration(
    tree,
    `${directory.split('/').join('-')}${directory ? '-' : ''}${name}`
  );

  return {
    config,
    fullName: config.name.split('feature-').join('').split('-'),
    newName: name.split('feature-').join('').toLowerCase(),
  };
};

export const addCoverageToJest = (tree: Tree, config: ProjectConfiguration): void => {
  const filePath = path.join(config.root, 'jest.config.ts');
  let fileContents = tree.read(filePath).toString().slice(0, -3);
  fileContents += "  collectCoverageFrom: ['**/*.ts', '!**/index.ts', '!**/jest.config.ts'],\n";
  fileContents +=
    "  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],\n";
  fileContents += '};\n';
  tree.write(filePath, fileContents);
};

export const renameTsLib = (tree: Tree, name: string, directory?: string): void => {
  const originalLib = `@finance/${directory}${directory ? '/' : ''}${name}`;
  const newLib = originalLib.replace('feature-', '');
  const removeIndexMap = (paths: string[]): string[] =>
    paths.map(path => path.split('/index.ts')[0]);

  updateJson(tree, 'tsconfig.base.json', tsconfig => {
    const paths = tsconfig.compilerOptions.paths;
    paths[newLib] = removeIndexMap(paths[originalLib]);
    delete paths[originalLib];
    return tsconfig;
  });
};
