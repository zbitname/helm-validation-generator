import { ControlCommentRepo } from './classes/ControlCommentRepo';
import { RefControlComment } from './control-comments/ref';
import { SkipControlComment } from './control-comments/skip';
import { flatten } from './flatten';
import { operationCompiler } from './operation-compiler';
import { parse } from './parse-yaml';
import { buildSchema } from './schema-builder';
import {
  IChartItemWithOptions,
  IJSONSchemaRoot,
  TControlCommentConstructor,
} from './interfaces';
import { chain, isEqual } from 'lodash';

const allControlComments: Record<string, TControlCommentConstructor> = {
  ref: RefControlComment,
  skip: SkipControlComment,
};

export const generateSchemaValidation = (
  contents: string[],
  definitions: IJSONSchemaRoot['$defs'],
  controlComments: Record<string, TControlCommentConstructor> = allControlComments,
) => {
  const controlCommentRepo = new ControlCommentRepo();

  for (const name in controlComments) {
    controlCommentRepo.add(name, controlComments[name]);
  }

  const flat: IChartItemWithOptions[] = [];

  for (const content of contents) {
    const res = parse(content);

    for (const r of res) {
      flat.push(...flatten([], r.getChartItem()));
    }
  }

  const uniqFlatItems = chain(flat).uniqWith((a, b) => {
    for (const key of (['path', 'type', 'comment', 'options', 'prop'] as (keyof IChartItemWithOptions)[])) {
      if (!isEqual(a[key], b[key])) return false;
    }
    return true;
  }).sortBy('path').value();

  const rootItems = uniqFlatItems.filter(i => i.path === '');

  if (rootItems.length !== 1) {
    throw new Error(`Expected one root item, but got ${rootItems.length} with types [${rootItems.map(i => i.type).join(', ')}]`);
  }

  const flatCompiledItems = operationCompiler(uniqFlatItems, controlCommentRepo, {
    additionalProperties: false,
  });
  const schema = buildSchema(flatCompiledItems, definitions);

  return schema;
};
