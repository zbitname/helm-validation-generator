import { readFileSync, readdirSync } from 'fs';
import { resolve, isAbsolute } from 'path';
import { Command } from 'commander';
import Ajv from 'ajv';
import {
  parse,
} from 'yaml';
import { merge } from 'lodash';

export default (program: Command) => {
  program
    .command('validate')
    .requiredOption('-c --chart-dir <dir>')
    .option('-f, --values <path>')
    .action(opts => {
      const chartDir = isAbsolute(opts.chartDir) ? opts.chartDir : resolve(process.cwd(), opts.chartDir);

      const files = readdirSync(chartDir);
      const valuesFileName = files.find(i => /^values\.ya*ml$/i.test(i));

      if (!valuesFileName) {
        console.error('Chart directory should contain "values.yaml" or "values.yml" file');
        process.exit(1);
      }

      const valuesSchemaFileName = files.find(i => /^values\.schema\.json$/i.test(i));

      if (!valuesSchemaFileName) {
        console.error('Chart directory should contain "values.schema.json" file');
        process.exit(1);
      }

      const schemaFullPath = resolve(chartDir, valuesSchemaFileName);
      const valuesFullPath = resolve(chartDir, valuesFileName);

      console.log('Load file', schemaFullPath);
      const schema = JSON.parse(readFileSync(schemaFullPath).toString());

      console.log('Load file', valuesFullPath);
      const mainValues = parse(readFileSync(valuesFullPath).toString());

      if (opts.values) {
        const clientVauesPath = isAbsolute(opts.values) ? opts.values : resolve(process.cwd(), opts.values);
        console.log('Load file', clientVauesPath);
        merge(mainValues, parse(readFileSync(clientVauesPath).toString()));
      }

      const ajv = new Ajv({
        inlineRefs: true,
        discriminator: true,
      });
      const validate = ajv.compile(schema);
      const success = validate(mainValues);

      if (!success) {
        console.log('Validation errors:', JSON.stringify(validate.errors, null, 2));
        process.exit(1);
      }

      console.log('Validation has finihed successfuly');
    });
};
