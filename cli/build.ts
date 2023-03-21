import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, isAbsolute } from 'path';
import { Command, Option } from 'commander';
import Ajv from 'ajv';
import {
  parse,
} from 'yaml';

import { generateSchemaValidation } from '../src/lib';

export default (program: Command) => {
  program
    .command('build')
    .requiredOption('-v, --values <path>')
    .option('-d, --def <path>')
    .option('-o, --out <path>')
    .addOption(new Option('-i --indentation <number>', 'indentation for serialization').preset('2').argParser(parseInt))
    .addOption(new Option('-f --skip-validation', 'indentation for serialization').preset(true))
    .action(opts => {
      const valuesPath = isAbsolute(opts.values) ? opts.values : resolve(process.cwd(), opts.values);
      const values = readFileSync(valuesPath).toString();

      let def: any = {};

      if (opts.def) {
        const defPath = isAbsolute(opts.def) ? opts.def : resolve(process.cwd(), opts.def);

        if (existsSync(defPath)) {
          def = JSON.parse(readFileSync(defPath).toString());
        } else {
          throw new Error('Definition file not found');
        }
      }

      let outPath = `${dirname(resolve(process.cwd(), opts.values))}/values.schema.json`;

      if (opts.out) {
        outPath = isAbsolute(opts.out) ? opts.out : resolve(process.cwd(), opts.out);
      }

      const schema = generateSchemaValidation(values, def);

      if (!opts.skipValidation) {
        console.log('Validation: start');

        const ajv = new Ajv({
          inlineRefs: true,
          discriminator: true,
        });
        const validate = ajv.compile(schema);
        const success = validate(parse(values));

        if (!success) {
          console.log('Errors', validate.errors);
        }

        console.log('Validation: finish');
      }

      writeFileSync(outPath, JSON.stringify(schema, null, 2));
    });
};
