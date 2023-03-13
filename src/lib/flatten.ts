import { IChartItemWithOptions } from './interfaces';

// 2nd stage
export const flatten = (parent: IChartItemWithOptions[], element: IChartItemWithOptions): IChartItemWithOptions[] => {
  parent.push({
    path: element.path,
    pathTemplate: element.pathTemplate,
    types: element.types,
    values: element.values,
    comment: element.comment,
    prop: element.prop,
    options: element.options,
  });

  if (!element.children || !element.children.length) {
    return parent.slice();
  }

  for (const item of element.children) {
    flatten(parent, item);
  }

  return parent.slice();
};
