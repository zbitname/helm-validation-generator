import {
  IChartItemWithOperations,
  IChartItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  IJSONSchema,
  ISchemaParams,
  TControlOperations,
} from './interfaces';

// 3rd stage
export const operationFiller = (
  chartItems: IChartItemWithOptions[],
  controlCommentsRepo: IControlCommentRepo,
): IChartItemWithOperations[] => {
  const result: IChartItemWithOperations[] = [];
  const schemaParams: ISchemaParams = {
    skipTemplatePaths: [],
  };

  for (const item of chartItems) {
    const operations: TControlOperations = {};

    for (const option of (item.options || [])) {
      const ControlComment = controlCommentsRepo.get(option.name);
      const schema: IJSONSchema = {};
      const controlComment = new ControlComment(schemaParams, {
        inputSchema: schema,
        templatePath: item.pathTemplate,
      }) as IControlComment;

      controlComment.before(...option.args);

      if (schemaParams.skipTemplatePaths.some(i => item.pathTemplate.startsWith(i))) {
        continue;
      }

      schema.type = item.type;
    }

    result.push({
      ...item,
      children: [],
      operations,
    });
  }

  return result;
};
