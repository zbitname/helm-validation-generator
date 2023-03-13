import {
  IChartItemWithOperations,
  IChartItemWithOptions,
  IControlComment,
  IControlCommentRepo,
  TControlOperations,
} from './interfaces';

export const fill = (chartItems: IChartItemWithOptions[], controlCommentsRepo: IControlCommentRepo): IChartItemWithOperations[] => {
  const result: IChartItemWithOperations[] = [];

  for (const item of chartItems) {
    const operations: TControlOperations = {};

    for (const option of (item.options || [])) {
      const ControlComment = controlCommentsRepo.get(option.name);
      const controlComment = new ControlComment() as IControlComment;
      const compiledOp = controlComment.compile(...option.args);

      operations.skip = compiledOp.skip ?? operations.skip;

      if (!operations.patchSchema) {
        operations.patchSchema = compiledOp.patchSchema;
      } else {
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
