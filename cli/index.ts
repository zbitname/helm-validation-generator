import { Command } from 'commander';
import build from './build';

const program = new Command();

program
  .name('Schema validation builder')
  .description('')
  .version('0.0.1');

build(program);

program.parse();

