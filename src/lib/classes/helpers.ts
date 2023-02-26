import { TItemValue } from '../interfaces';

export const getTypeByValue = (value: any): TItemValue => {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  const valueTypeOf = typeof value;
  switch (valueTypeOf) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
    case 'object':
      return valueTypeOf;
  }

  return 'unknown';
};
