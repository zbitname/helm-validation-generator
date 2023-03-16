/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { parse } from '../../src/lib/parse-yaml';
import { expect } from 'chai';
import { flatten } from '../../src/lib/flatten';
import { operationCompiler } from '../../src/lib/operation-compiler';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { buildSchema } from '../../src/lib/schema-builder';

describe('Schema builder', () => {
  describe('file=different-types-in-one-item.yaml', () => {
    const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

    const controlCommentRepo = new ControlCommentRepo();

    it('main case', () => {
      const content = BASE_CONTENT;
      const res = parse(content);
      const flat = flatten([], res[0].getChartItem());
      const flatCompiledItems = operationCompiler(flat, controlCommentRepo);
      const schema = buildSchema(flatCompiledItems, {
        additionalProperties: false,
      });

      expect(schema).to.deep.equals({
        oneOf: [
          {
            type: 'object',
            properties: {
              prop1: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      num: { oneOf: [ { type: 'number' } ] },
                      str: { oneOf: [ { type: 'string' } ] },
                      bool: { oneOf: [ { type: 'boolean' } ] },
                      null: { oneOf: [ { type: 'null' } ] },
                      arr: {
                        oneOf: [
                          {
                            type: 'array',
                            items: {
                              oneOf: [
                                { type: 'number' },
                                { type: 'string' },
                                { type: 'boolean' },
                                { type: 'null' },
                              ]
                            }
                          }
                        ]
                      },
                      obj: {
                        oneOf: [
                          {
                            type: 'object',
                            properties: {
                              subnum: { oneOf: [ { type: 'number' } ] },
                              substr: { oneOf: [ { type: 'string' } ] },
                              subbool: { oneOf: [ { type: 'boolean' } ] },
                              subnull: { oneOf: [ { type: 'null' } ] },
                            },
                            required: [ 'subnum', 'substr', 'subbool', 'subnull' ],
                            additionalProperties: false,
                          }
                        ]
                      }
                    },
                    required: [ 'num', 'str', 'bool', 'null', 'arr', 'obj' ],
                    additionalProperties: false,
                  }
                ]
              }
            },
            required: [ 'prop1' ],
            additionalProperties: false,
          }
        ]
      });
    });
  });
});
