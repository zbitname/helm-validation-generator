import {
  IChartItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  ISchemaParams,
  JSONSchemaItem,
} from './interfaces';

// 3rd stage
export const operationCompiler = (
  chartItems: IChartItemWithOptions[],
  controlCommentsRepo: IControlCommentRepo,
): IChartItemWithOptions[] => {
  const result: IChartItemWithOptions[] = [];
  const schemaParams: ISchemaParams = {
    skipTemplatePaths: [],
  };

  for (const item of chartItems) {
    for (const option of (item.options || [])) {
      const ControlComment = controlCommentsRepo.get(option.name);
      const schema: JSONSchemaItem = {};
      const controlComment = new ControlComment(schemaParams, {
        inputSchema: schema,
        templatePath: item.pathTemplate,
      }) as IControlComment;

      controlComment.before(...option.args);

      schema.type = item.type;
    }

    if (schemaParams.skipTemplatePaths.some(i => item.pathTemplate.startsWith(i))) {
      continue;
    }

    result.push({
      ...item,
      children: [],
    });
  }

  return result;
};
