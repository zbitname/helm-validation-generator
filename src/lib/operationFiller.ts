import {
  IChartItemWithOperations,
  IChartItemWithOptions,
  IControlCommentRepo,
  TControlOperations,
} from './interfaces';

export const fill = (chartItems: IChartItemWithOptions[], controlCommentsRepo: IControlCommentRepo): IChartItemWithOperations[] => {
  const result: IChartItemWithOperations[] = [];

  for (const item of chartItems) {
    const operations: TControlOperations = {};

    if (item.options && item.options.length) {
      for (const option of item.options) {
        const ControlComment = controlCommentsRepo.get(option.name);
        const controlComment = new ControlComment();
        Object.assign(operations, controlComment?.compile(...option.args));
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
