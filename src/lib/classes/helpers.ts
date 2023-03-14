import { TJSONSchemaType } from '../interfaces';

export const getTypeByValue = (value: any): TJSONSchemaType => {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  const valueTypeOf = typeof value;
  switch (valueTypeOf) {
    case 'undefined':
      return 'null';

    case 'bigint':
    case 'number':
      return 'number';

    case 'boolean':
    case 'object':
    case 'string':
      return valueTypeOf;
  }

  return 'null';
};
