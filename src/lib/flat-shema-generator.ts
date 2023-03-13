import {
  IChartItemWithOperations,
  IJSONSchemaForProcessing,
  TItemValue,
} from './interfaces';

// 4th stage
export const getJSONSchemaFromFlat = (chartItems: IChartItemWithOperations[]): IJSONSchemaForProcessing[] => {
  const pathTemplates: string[] = [];
  const result: IJSONSchemaForProcessing[] = [];

  const chartItemsSorted = chartItems.slice().sort((a, b) => {
    if (a.pathTemplate < b.pathTemplate) return -1;
    if (a.pathTemplate > b.pathTemplate) return 1;
    return 0;
  });

  for (let i = 0; i < chartItemsSorted.length; i++) {
    const item = chartItemsSorted[i];

    if (!item.path) continue;
    if (pathTemplates.includes(item.pathTemplate)) continue;

    const sameItems = chartItemsSorted.filter(i => i.pathTemplate === item.pathTemplate);

    result.push(...getFlatJSONSchema(sameItems));

    pathTemplates.push(item.pathTemplate);
  }

  return result;
};

const getFlatJSONSchema = (items: IChartItemWithOperations[]): IJSONSchemaForProcessing[] => {
  const pathTemplates = new Set<string>();

  for (const item of items) {
    pathTemplates.add(item.pathTemplate);
  }

  if (pathTemplates.size > 1) {
    throw new Error('All of items for one schema item must has the same "pathTemplate"');
  }

  const pathTemplate = [...pathTemplates][0];

  const allTypes = items.map(i => i.types).reduce((p, c) => {
    for (const j of c) {
      p.add(j);
    }
    return p;
  }, new Set<TItemValue>());

  const result: IJSONSchemaForProcessing[] = [];

  for (const type of [...allTypes]) {
    const itemsWithType = items.filter(i => i.types.includes(type));

    switch (type) {
      case 'object':
        result.push({
          type: 'object',
          properties: [],
          required: [],
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      case 'array':
        result.push({
          type: 'array',
          items: [],
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      case 'number':
        result.push({
          type: 'number',
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      case 'string':
        result.push({
          type: 'string',
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      case 'boolean':
        result.push({
          type: 'boolean',
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      case 'null':
        result.push({
          type: 'null',
          pathTemplate,
          chartItems: itemsWithType,
        });
        break;

      default:
        console.log('UNSUPPORTED TYPE', itemsWithType);
        throw new Error('Unsupported type');
    }
  }

  return result;
};
