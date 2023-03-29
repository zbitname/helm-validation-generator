// 5th stage

// import { uniq } from 'lodash';
import {
  IJSONSchemaItem,
  IJSONSchemaRoot,
  TJSONSchemaType,
} from './interfaces';

// const SCALARS: TJSONSchemaType[] = ['boolean', 'integer', 'null', 'number', 'string'];

export const compact = (schema: IJSONSchemaRoot): IJSONSchemaRoot => {
  const result: IJSONSchemaRoot = {
    $schema: schema.$schema,
    $defs: schema.$defs || {},
  };

  Object.assign(result, compactItem(schema));

  return result;
};

const compactItem = (schema: IJSONSchemaItem): IJSONSchemaItem => {
  const result: IJSONSchemaItem = {};

  if (schema.oneOf && schema.oneOf.length > 0) {
    if (schema.oneOf.length === 1) {
      Object.assign(result, schema.oneOf[0]);

      for (const key in result.properties) {
        result.properties[key] = compactItem(result.properties[key]);
      }

      if (result.items) {
        result.items = compactItem(result.items);
      }
    } else {
      const groupedTypes: TJSONSchemaType[] = [];
      const otherSchemas: IJSONSchemaItem[] = [];

      for (const item of schema.oneOf) {
        if (Object.keys(item).filter(i => i !== 'type').length === 0) {
          if (item.type) {
            groupedTypes.push(item.type as TJSONSchemaType);
          }
        } else {
          otherSchemas.push(item);
        }
      }

      if (
        (groupedTypes.length > 0 && otherSchemas.length > 0)
        || (otherSchemas.length > 1)
      ) {
        result.oneOf = [ ...otherSchemas ];

        if (groupedTypes.length) {
          result.oneOf.push({ type: groupedTypes });
        }
      } else {
        Object.assign(result, { type: groupedTypes });
      }
    }
  }

  return result;
};
