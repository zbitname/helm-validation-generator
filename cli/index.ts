import { Command } from 'commander';
import build from './build';
import validate from './validate';

const program = new Command();

program
  .name('Schema validation builder')
  .description('')
  .version('0.0.1');

build(program);
validate(program);

program.parse();

