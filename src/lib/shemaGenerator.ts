import {
  IChartItemWithOperations,
} from './interfaces';

export const getJSONSchemaFromFlat = (chartItems: IChartItemWithOperations[]): any => {
  const flatSchema: any[] = [];
  const processedTemplates: string[] = [];

  for (let i = 0; i < chartItems.length; i++) {
    const item = chartItems[i];

    if (!item.path) continue;
    if (item.operations.skip) continue;

    // if .path is a part of array
    if (/\[/.test(item.path)) {
      console.log(item.path, item, chartItems.filter(i => i.pathTemplate === item.path));
      break;

      continue;
    }

    processedTemplates.push(item.path);
  }

  return flatSchema;
};
