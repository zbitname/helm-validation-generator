import { uniq } from 'lodash';

import {
  IChartItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  ISchemaParams,
  IJSONSchemaItem,
  ICompiledChartItem,
  TSchemaOptions,
} from './interfaces';

// 3rd stage
export const operationCompiler = (
  chartItems: IChartItemWithOptions[],
  controlCommentsRepo: IControlCommentRepo,
  params: TSchemaOptions = {},
): ICompiledChartItem[] => {
  const additionalProperties = params.additionalProperties ?? false;
  const result: ICompiledChartItem[] = [];
  const schemaParams: ISchemaParams = {
    skipTemplatePaths: [],
  };

  for (const item of chartItems) {
    const compiledChartItem: Partial<ICompiledChartItem> = {
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
        inputCompiledChartItem: compiledChartItem,
        templatePath: item.pathTemplate,
      }) as IControlComment;

      controlComment.before(...option.args);

      controlComment.after(...option.args);
    }

    if (schemaParams.skipTemplatePaths.some(i => item.pathTemplate.startsWith(i))) {
      continue;
    }

    const sameChartItemsMatch = item.path.match(/(.*)\[\d+\]/);
    const sameChartItems = chartItems.filter(i =>
      sameChartItemsMatch ? i.path.startsWith(sameChartItemsMatch[1]) : false
    );

    result.push({
      type: item.type,
      path: item.path,
      prop: item.prop,
      pathTemplate: item.pathTemplate,
      precompiledSchemaItem: schemaItem,
      countThis: sameChartItems.filter(i => i.pathTemplate === item.pathTemplate).length,
      countOf: uniq(sameChartItems.map(i => i.path.match(/.*\[(\d+)\]/)).filter(Boolean).map(i => i![1])).length,
      ...compiledChartItem,
    });
  }

  return result;
};
