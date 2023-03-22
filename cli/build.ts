import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, isAbsolute, basename } from 'path';
import { Command, Option } from 'commander';
import Ajv from 'ajv';
import {
  parse,
} from 'yaml';

import { generateSchemaValidation } from '../src/lib';
import { IJSONSchemaRoot } from '../src/lib/interfaces';

export default (program: Command) => {
  program
    .command('build')
    .requiredOption('-v, --values <path>')
    .option('-d, --def <path>')
    .option('-o, --out <path>')
    .addOption(new Option('-i --indentation <number>', 'Indentation for serialization').preset('2').argParser(parseInt))
    .addOption(new Option('--skip-validation', 'Skip validation after build the schema').preset(true))
    .addOption(new Option('--skip-ci', 'Skip CI configs').preset(true))
    .addOption(new Option('--skip-deprecation', 'Skip deprecation file').preset(true))
    .action(opts => {
      const valuesPath = isAbsolute(opts.values) ? opts.values : resolve(process.cwd(), opts.values);
      console.log('Load values file', `"${basename(valuesPath)}"`);
      const mainValues = readFileSync(valuesPath).toString();
      const values = [mainValues];
      const valuesDir = dirname(resolve(process.cwd(), opts.values));

      let def: any = {};

      if (opts.def) {
        const defPath = isAbsolute(opts.def) ? opts.def : resolve(process.cwd(), opts.def);

        if (existsSync(defPath)) {
          def = JSON.parse(readFileSync(defPath).toString());
        } else {
          throw new Error('Definition file not found');
        }
      } else {
        const defaultDefPath = `${valuesDir}/values.definitions.json`;

        if (existsSync(defaultDefPath)) {
          def = JSON.parse(readFileSync(defaultDefPath).toString());
        }
      }

      let outPath = `${valuesDir}/values.schema.json`;

      if (opts.out) {
        outPath = isAbsolute(opts.out) ? opts.out : resolve(process.cwd(), opts.out);
      }

      if (!opts.skipCi) {
        const ciDir = `${valuesDir}/ci`;

        if (existsSync(ciDir)) {
          console.log('Parse ci directory');
          const ciFilePaths = readdirSync(ciDir).filter(f => /\.ya{0,1}ml/i.test(f));

          for (const ciFilePath of ciFilePaths) {
            console.log(' - Load values file', `"ci/${ciFilePath}"`);
            values.push(readFileSync(`${ciDir}/${ciFilePath}`).toString());
          }
        }
      }

      if (!opts.skipDeprecation) {
        const depracationFilePaths = readdirSync(valuesDir).filter(f => /values\.deprecations\.ya{0,1}ml/i.test(f));

        for (const fileName of depracationFilePaths) {
          console.log(`Parse deprecation file "${fileName}"`);
          values.push(readFileSync(`${valuesDir}/${fileName}`).toString());
        }
      }

      let schema: IJSONSchemaRoot;
      try {
        schema = generateSchemaValidation(values, def)
      } catch (e) {
        console.log('Schema generation error:', (e as Error).message);
        process.exit(1);
      }

      if (!opts.skipValidation) {
        const ajv = new Ajv({
          inlineRefs: true,
          discriminator: true,
        });
        const validate = ajv.compile(schema);
        const success = validate(parse(mainValues));

        if (!success) {
          console.log('Validation errors:', JSON.stringify(validate.errors, null, 2));
          process.exit(1);
        }

        console.log('Validation has finihed successfuly');
      }

      writeFileSync(outPath, JSON.stringify(schema, null, 2));
    });
};
