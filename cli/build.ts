import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Command, Option } from 'commander';

import { generateSchemaValidation } from '../src/lib';

export default (program: Command) => {
  program
    .command('build')
    .requiredOption('-v, --values <path>')
    .addOption(new Option('-i --indentation <number>', 'indentation for serialization').preset('2').argParser(parseInt))
    .action(opts => {
      const valuesPath = resolve(process.cwd(), opts.values);
      const content = readFileSync(valuesPath).toString();

      const schema = generateSchemaValidation(content, {});

      console.log(JSON.stringify(schema, null, 2));
    });
};
