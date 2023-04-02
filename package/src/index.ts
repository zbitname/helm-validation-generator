import { ControlCommentRepo } from './classes/ControlCommentRepo';
import { RefControlComment } from './control-comments/ref';
import { SkipControlComment } from './control-comments/skip';
import { flatten } from './flatten';
import { operationCompiler } from './operation-compiler';
import { parse } from './parse-yaml';
import { buildSchema } from './schema-builder';
import {
  IDocumentItemWithOptions,
  IGenerateSchemaValidationOptions,
  IJSONSchemaRoot,
  TControlCommentConstructor,
} from './interfaces';
import { chain, isEqual } from 'lodash';
import { DeprecatedControlComment } from './control-comments/deprecated';
import { OptionalControlComment } from './control-comments/optional';
import { compact } from './compact';

const allControlComments: Record<string, TControlCommentConstructor> = {
  ref: RefControlComment,
  skip: SkipControlComment,
  deprecated: DeprecatedControlComment,
  optional: OptionalControlComment,
};

export const generateSchemaValidation = (
  contents: string[],
  definitions: IJSONSchemaRoot['$defs'],
  controlComments: Record<string, TControlCommentConstructor> = allControlComments,
  options: IGenerateSchemaValidationOptions = {},
) => {
  const controlCommentRepo = new ControlCommentRepo();

  for (const name in controlComments) {
    controlCommentRepo.add(name, controlComments[name]);
  }

  const flat: IDocumentItemWithOptions[] = [];

  for (const content of contents) {
    const res = parse(content);

    for (const r of res) {
      flat.push(...flatten([], r.getDocumentItem()));
    }
  }

  const uniqFlatItems = chain(flat).uniqWith((a, b) => {
    for (const key of (['path', 'type', 'comment', 'options', 'prop'] as (keyof IDocumentItemWithOptions)[])) {
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
  let schema = buildSchema(flatCompiledItems, definitions);

  if (options.compact) {
    const compactedSchema = compact(schema);
    schema = compactedSchema;
  }

  return schema;
};
