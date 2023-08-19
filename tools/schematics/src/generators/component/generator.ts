import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ComponentGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/angular/generators';
import { addCoverageToJest, getProjectConfig, renameTsLib } from '../../utils';

export async function financeComponentGenerator(tree: Tree, options: ComponentGeneratorSchema) {
  await libraryGenerator(tree, {
    ...options,
    standalone: true,
    flat: true,
    inlineStyle: true,
    inlineTemplate: true,
  });
  const { config, fullName, newName } = getProjectConfig(tree, options.name, options.directory);

  tree.rename(
    `${config.sourceRoot}/lib/${config.name}.component.ts`,
    `${config.sourceRoot}/lib/${newName}.component.ts`
  );
  tree.rename(
    `${config.sourceRoot}/lib/${config.name}.component.spec.ts`,
    `${config.sourceRoot}/lib/${newName}.component.spec.ts`
  );

  generateFiles(tree, path.join(__dirname, './templates'), config.sourceRoot, {
    compName: fullName.map(s => s[0].toUpperCase() + s.substring(1)).join(''),
    description: options.description,
    fullName,
    name: newName,
    year: new Date().getFullYear(),
  });
  addCoverageToJest(tree, config);
  renameTsLib(tree, options.name, options.directory);

  await formatFiles(tree);
}

export default financeComponentGenerator;
