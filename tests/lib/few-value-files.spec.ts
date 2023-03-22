/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';
import { generateSchemaValidation } from '../../src/lib';

describe('Few value files', () => {
  it('1-lvl-array-with-scalars-twice.yaml + root-array.yaml', () => {
    const contents: string[] = [
      readFileSync(`${__dirname}/files/1-lvl-array-with-scalars-twice.yaml`).toString(),
      readFileSync(`${__dirname}/files/root-array.yaml`).toString(),
    ];
    const schema = generateSchemaValidation(contents, {});

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      oneOf: [{
        type: 'array',
        items: {
          oneOf: [
            { type: 'boolean' },
            { type: 'string' },
            { type: 'number' },
            { type: 'null' },
          ],
        },
      }],
      $defs: {},
    });
  });

  it('1-lvl-array-with-scalars-twice.yaml + array-different-objects.yaml', () => {
    const contents: string[] = [
      readFileSync(`${__dirname}/files/1-lvl-array-with-scalars-twice.yaml`).toString(),
      readFileSync(`${__dirname}/files/array-different-objects.yaml`).toString(),
    ];
    expect(() => generateSchemaValidation(contents, {})).throws(Error);
  });
});
