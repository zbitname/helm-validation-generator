// 5th stage

import { uniq } from 'lodash';
import {
  IJSONSchemaItem,
  IJSONSchemaRoot,
  TJSONSchemaType,
} from './interfaces';

const SCALARS: TJSONSchemaType[] = ['boolean', 'integer', 'null', 'number', 'string'];

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

  if (schema.oneOf) {
    if (schema.oneOf.length === 1) {
      Object.assign(result, schema.oneOf[0]);

      for (const key in result.properties) {
        result.properties[key] = compactItem(result.properties[key]);
      }

      if (result.items) {
        result.items = compactItem(result.items);
      }
    } else {
      const types = uniq(schema.oneOf.map(i => i.type).filter(Boolean).flat()) as TJSONSchemaType[];

      if (
        types.every(i => SCALARS.includes(i))
        && schema.oneOf.every(i => Object.keys(i).filter(k => k !== 'type').length === 0)
      ) {
        Object.assign(result, {
          type: types,
        });
      } else {
        Object.assign(result, schema);
      }
    }
  }

  return result;
};
