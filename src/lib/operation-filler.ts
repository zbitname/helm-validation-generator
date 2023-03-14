import {
  IChartItemWithOperations,
  IChartItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  TControlOperations,
} from './interfaces';

// 3rd stage
export const operationFiller = (
  chartItems: IChartItemWithOptions[],
  controlCommentsRepo: IControlCommentRepo,
): IChartItemWithOperations[] => {
  const result: IChartItemWithOperations[] = [];

  for (const item of chartItems) {
    const operations: TControlOperations = {};

    for (const option of (item.options || [])) {
      const ControlComment = controlCommentsRepo.get(option.name);
      const controlComment = new ControlComment() as IControlComment;
      const compiledOp = controlComment.getOperations(...option.args);

      operations.skip = compiledOp.skip ?? operations.skip;

      if (!operations.patchSchema) {
        operations.patchSchema = compiledOp.patchSchema;
      } else {
        // coverage: you need a few control-comments with `.patchSchema` option
        operations.patchSchema.push(...(compiledOp.patchSchema || []));
      }
    }

    result.push({
      ...item,
      children: [],
      operations,
    });
  }

  return result;
};
