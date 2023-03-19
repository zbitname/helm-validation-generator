import {
  ICompiledChartItem,
  IJSONSchemaRoot,
  IJSONSchemaItem,
} from './interfaces';

const getParentPathTemplate = (pathTemplate: string) => pathTemplate.split(/(?<!\\)\./).slice(0, -1).join('.');

// 4th stage
export const buildSchema = (
  chartItems: ICompiledChartItem[],
  schemaDefinitions?: IJSONSchemaRoot['$def'],
): IJSONSchemaRoot => {
  const result: IJSONSchemaRoot = {
    oneOf: [],
  };
  const cache: Record<string, IJSONSchemaItem[]> = {};

  for (const item of chartItems) {
    if (!result.oneOf) {
      result.oneOf = [];
    }

    const parentPathTemplate = getParentPathTemplate(item.pathTemplate);
    const parentSchemaItems = cache[parentPathTemplate];
    const schemaItem: IJSONSchemaItem =
      cache[item.pathTemplate]?.find(i => i.type === item.type)
      || { ...item.precompiledSchemaItem };

    if (!parentSchemaItems) {
      if (!cache[item.pathTemplate]) {
        cache[item.pathTemplate] = [];
      }

      cache[item.pathTemplate].push(schemaItem);
      result.oneOf.push(schemaItem);

      continue;
    }

    if (!cache[item.pathTemplate]) {
      cache[item.pathTemplate] = [];
    }

    cache[item.pathTemplate].push(schemaItem);

    const parentSchemaItem = parentSchemaItems.find(i => item.prop ? i.type === 'object' : i.type === 'array');

    if (!parentSchemaItem) {
      throw new Error('Parent schema not found');
    }

    switch (parentSchemaItem.type) {
      case 'array':
        if (!parentSchemaItem.items?.oneOf?.find(i => i.type === schemaItem.type)) {
          parentSchemaItem.items?.oneOf?.push(schemaItem);
        }
        break;

      case 'object':
        if (!item.prop) throw new Error('How an object can has empty property name?');
        if (!parentSchemaItem.properties) parentSchemaItem.properties = {};
        if (!parentSchemaItem.properties[item.prop]) parentSchemaItem.properties[item.prop] = {
          oneOf: [],
        };

        parentSchemaItem.required?.push(item.prop);
        parentSchemaItem.properties[item.prop].oneOf!.push(schemaItem);
        break;
    }
  }

  return {
    ...result,
    ...schemaDefinitions && { $def: schemaDefinitions },
  };
};
