import { uniq } from 'lodash';

import {
  IDocumentItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  ISchemaParams,
  IJSONSchemaItem,
  ICompiledDocumentItem,
  TSchemaOptions,
} from './interfaces';

// 3rd stage
export const operationCompiler = (
  documentItems: IDocumentItemWithOptions[],
  controlCommentsRepo: IControlCommentRepo,
  params: TSchemaOptions = {},
): ICompiledDocumentItem[] => {
  const additionalProperties = params.additionalProperties ?? false;
  const result: ICompiledDocumentItem[] = [];
  const schemaParams: ISchemaParams = {
    skipTemplatePaths: [],
  };

  for (const item of documentItems) {
    const compiledDocumentItem: Partial<ICompiledDocumentItem> = {
      type: item.type,
      path: item.path,
      prop: item.prop,
      pathTemplate: item.pathTemplate,
    };
    const schemaItem: IJSONSchemaItem = {
      type: item.type,
    };

    schemaItem.type = item.type;

    switch (schemaItem.type) {
      case 'array':
        // schemaItem.items = {
        //   oneOf: [],
        // };
        break;

      case 'object':
        schemaItem.properties = {};
        schemaItem.required = [];
        schemaItem.additionalProperties = additionalProperties;
        break;
    }

    for (const option of (item.options || [])) {
      const ControlComment = controlCommentsRepo.get(option.name);
      const controlComment = new ControlComment(schemaParams, {
        inputSchema: schemaItem,
        inputCompiledDocumentItem: compiledDocumentItem,
        templatePath: item.pathTemplate,
      }) as IControlComment;

      controlComment.before(...option.args);

      controlComment.after(...option.args);
    }

    if (schemaParams.skipTemplatePaths.some(i => item.pathTemplate.startsWith(i))) {
      continue;
    }

    const sameDocumentItemsMatch = item.path.match(/(.*)\[\d+\]/);
    const sameDocumentItems = documentItems.filter(i =>
      sameDocumentItemsMatch ? i.path.startsWith(sameDocumentItemsMatch[1]) : false
    );

    result.push({
      type: item.type,
      path: item.path,
      prop: item.prop,
      pathTemplate: item.pathTemplate,
      precompiledSchemaItem: schemaItem,
      countThis: sameDocumentItems.filter(i => i.pathTemplate === item.pathTemplate).length,
      countOf: uniq(sameDocumentItems.map(i => i.path.match(/.*\[(\d+)\]/)).filter(Boolean).map(i => i![1])).length,
      ...compiledDocumentItem,
    });
  }

  return result;
};
