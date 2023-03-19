import { ControlCommentRepo } from './classes/ControlCommentRepo';
import { RefControlComment } from './control-comments/ref';
import { SkipControlComment } from './control-comments/skip';
import { flatten } from './flatten';
import { IJSONSchemaRoot, TControlCommentConstructor } from './interfaces';
import { operationCompiler } from './operation-compiler';
import { parse } from './parse-yaml';
import { buildSchema } from './schema-builder';

const allControlComments: Record<string, TControlCommentConstructor> = {
  ref: RefControlComment,
  skip: SkipControlComment,
};

export const generateSchemaValidation = (
  content: string,
  definitions: IJSONSchemaRoot['definitions'],
  controlComments: Record<string, TControlCommentConstructor> = allControlComments,
) => {
  const controlCommentRepo = new ControlCommentRepo();

  for (const name in controlComments) {
    controlCommentRepo.add(name, controlComments[name]);
  }

  const res = parse(content);
  const flat = flatten([], res[0].getChartItem());
  const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
    additionalProperties: false,
  });
  const schema = buildSchema(flatCompiledItems, definitions);

  return schema;
};
