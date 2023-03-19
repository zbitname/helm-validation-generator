/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { parse } from '../../src/lib/parse-yaml';
import { expect } from 'chai';
import { flatten } from '../../src/lib/flatten';
import { operationCompiler } from '../../src/lib/operation-compiler';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { buildSchema } from '../../src/lib/schema-builder';
import { RefControlComment } from '../../src/lib/control-comments/ref';
import { schemaUrl } from '../../src/lib/consts';

describe('Schema builder', () => {
  it('file=different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems);

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'object',
        properties: {
          prop1: {
            oneOf: [{
              type: 'object',
              properties: {
                num: { oneOf: [ { type: 'number' } ] },
                str: { oneOf: [ { type: 'string' } ] },
                bool: { oneOf: [ { type: 'boolean' } ] },
                null: { oneOf: [ { type: 'null' } ] },
                arr: {
                  oneOf: [{
                    type: 'array',
                    items: {
                      oneOf: [
                        { type: 'number' },
                        { type: 'string' },
                        { type: 'boolean' },
                        { type: 'null' },
                      ]
                    }
                  }]
                },
                obj: {
                  oneOf: [{
                    type: 'object',
                    properties: {
                      subnum: { oneOf: [ { type: 'number' } ] },
                      substr: { oneOf: [ { type: 'string' } ] },
                      subbool: { oneOf: [ { type: 'boolean' } ] },
                      subnull: { oneOf: [ { type: 'null' } ] },
                    },
                    required: [ 'subnum', 'substr', 'subbool', 'subnull' ],
                    additionalProperties: false,
                  }]
                }
              },
              required: [ 'num', 'str', 'bool', 'null', 'arr', 'obj' ],
              additionalProperties: false,
            }]
          }
        },
        required: [ 'prop1' ],
        additionalProperties: false,
      }]
    });
  });

  it('file=1-lvl-array-with-scalars-twice.yaml', () => {
    const content = readFileSync(`${__dirname}/files/1-lvl-array-with-scalars-twice.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems);

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
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
    });
  });

  it('file=mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems);

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'array',
        items: {
          oneOf: [
            { type: 'null' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'string' },
            {
              type: 'array',
            },
            {
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            },
          ],
        },
      }],
    });
  });

  it('file=prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems);

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'object',
        properties: {
          prop1: { oneOf: [ { type: 'string' } ] },
          prop2: { oneOf: [ { type: 'number' } ] },
          prop3: { oneOf: [ { type: 'number' } ] },
          prop4: { oneOf: [ { type: 'boolean' } ] },
          prop5: { oneOf: [ { type: 'null' } ] },
          prop6: {
            oneOf: [{
              type: 'array',
            }],
          },
          prop7: {
            oneOf: [{
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            }],
          },
          prop8: {
            oneOf: [{
              type: 'array',
              items: {
                oneOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' },
                  { type: 'null' },
                  {
                    type: 'array',
                  },
                  {
                    type: 'object',
                    properties: {},
                    required: [],
                    additionalProperties: false,
                  },
                ],
              },
            }],
          },
          prop9: {
            oneOf: [{
              type: 'object',
              properties: {
                subprop1: { oneOf: [ { type: 'string' } ] },
                subprop2: { oneOf: [ { type: 'number' } ] },
                subprop3: { oneOf: [ { type: 'number' } ] },
                subprop4: { oneOf: [ { type: 'boolean' } ] },
                subprop5: { oneOf: [ { type: 'null' } ] },
                subprop6: {
                  oneOf: [{
                    type: 'array',
                  }],
                },
                subprop7: {
                  oneOf: [{
                    type: 'object',
                    properties: {},
                    required: [],
                    additionalProperties: false,
                  }]
                }
              },
              required: [ 'subprop1', 'subprop2', 'subprop3', 'subprop4', 'subprop5', 'subprop6', 'subprop7' ],
              additionalProperties: false,
            }],
          },
        },
        required: [ 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9' ],
        additionalProperties: false,
      }],
    });
  });

  it('file=root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems);

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'array',
        items: { oneOf: [ { type: 'string' } ] },
      }],
    });
  });

  it('file=simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems, {
      ItemArray: {
        type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  name: { oneOf: [ { type: 'string' } ] },
                  value: { oneOf: [ { type: 'string' } ] },
                  description: { oneOf: [ { type: 'string' } ] },
                },
                required: [ 'name', 'value', 'description' ],
                additionalProperties: false,
              },
            ],
          },
      },
      Elements: {
        type: 'array',
        items: { oneOf: [ { type: 'string' } ] },
      },
    });

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [
        {
          type: 'object',
          properties: {
            someProp: { oneOf: [ { type: 'string' } ] },
            somePropWithComment: { oneOf: [ { type: 'string' } ] },
            items: { oneOf: [ { $ref: '#/definitions/ItemArray' } ] },
            elements: { oneOf: [ { $ref: '#/definitions/Elements' } ] },
            props: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    p1: { oneOf: [ { type: 'string' } ] },
                    p2: { oneOf: [ { type: 'string' } ] },
                    p3: { oneOf: [ { type: 'string' } ] },
                  },
                  required: [ 'p1', 'p2', 'p3' ],
                  additionalProperties: false,
                },
              ],
            },
          },
          required: [ 'someProp', 'somePropWithComment', 'items', 'elements', 'props' ],
          additionalProperties: false,
        },
      ],
      definitions: {
        ItemArray: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  name: { oneOf: [ { type: 'string' } ] },
                  value: { oneOf: [ { type: 'string' } ] },
                  description: { oneOf: [ { type: 'string' } ] },
                },
                required: [ 'name', 'value', 'description' ],
                additionalProperties: false,
              },
            ],
          },
        },
        Elements: {
          type: 'array',
          items: { oneOf: [ { type: 'string' } ] },
        },
      },
    });
  });

  it('file=issue-dot-notationed-keys.yaml', () => {
    const content = readFileSync(`${__dirname}/files/issue-dot-notationed-keys.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems, {});

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'object',
        properties: {
          ingress: {
            oneOf: [{
              type: 'object',
              properties: {
                annotations: {
                  oneOf: [{
                    type: 'object',
                    properties: {
                      'kubernetes.io/ingress.class': {
                        oneOf: [ { type: 'string' } ],
                      },
                      'nginx.ingress.kubernetes.io/proxy-body-size': {
                        oneOf: [ { type: 'string' } ],
                      },
                      'nginx.ingress.kubernetes.io/proxy-read-timeout': {
                        oneOf: [ { type: 'string' } ],
                      },
                      'nginx.ingress.kubernetes.io/proxy-send-timeout': {
                        oneOf: [ { type: 'string' } ],
                      },
                      'nginx.ingress.kubernetes.io/limit-rps': {
                        oneOf: [ { type: 'string' } ],
                      },
                      'nginx.ingress.kubernetes.io/limit-rpm': {
                        oneOf: [ { type: 'string' } ],
                      },
                    },
                    required: [
                      'kubernetes.io/ingress.class',
                      'nginx.ingress.kubernetes.io/proxy-body-size',
                      'nginx.ingress.kubernetes.io/proxy-read-timeout',
                      'nginx.ingress.kubernetes.io/proxy-send-timeout',
                      'nginx.ingress.kubernetes.io/limit-rps',
                      'nginx.ingress.kubernetes.io/limit-rpm',
                    ],
                    additionalProperties: false,
                  }],
                },
              },
              required: [ 'annotations' ],
              additionalProperties: false,
            }],
          },
        },
        'required': [ 'ingress' ],
        'additionalProperties': false,
      }],
      definitions: {},
    });
  });

  it('file=array-similar-objects.yaml', () => {
    const content = readFileSync(`${__dirname}/files/array-similar-objects.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems, {});

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'object',
        properties: {
          some: {
            oneOf: [{
              type: 'array',
              items: {
                oneOf: [{
                  type: 'object',
                  properties: {
                    if: {
                      oneOf: [{
                        type: 'object',
                        properties: {
                          args: {
                            oneOf: [{
                              type: 'object',
                              properties: {
                                status: { oneOf: [ { type: 'string' } ] },
                              },
                              required: [ 'status' ],
                              additionalProperties: false,
                            }],
                          },
                        },
                        required: [ 'args' ],
                        additionalProperties: false,
                      }],
                    },
                    then: {
                      oneOf: [{
                        type: 'array',
                        items: { oneOf: [ { type: 'string' } ] },
                      }],
                    },
                  },
                  required: [ 'if', 'then' ],
                  additionalProperties: false,
                }],
              },
            }],
          },
        },
        required: [ 'some' ],
        additionalProperties: false,
      }],
      definitions: {},
    });
  });

  it('file=array-different-objects.yaml', () => {
    const content = readFileSync(`${__dirname}/files/array-different-objects.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = buildSchema(flatCompiledItems, {});

    expect(schema).to.deep.equals({
      $schema: schemaUrl,
      oneOf: [{
        type: 'object',
        properties: {
          some: {
            oneOf: [{
              type: 'array',
              items: {
                oneOf: [{
                  type: 'object',
                  properties: {
                    foo: { oneOf: [ { type: 'string' } ] },
                    bar: { oneOf: [ { type: 'string' } ] },
                  },
                  required: [ 'bar' ],
                  additionalProperties: false,
                }],
              },
            }],
          },
        },
        required: [ 'some' ],
        additionalProperties: false,
      }],
      definitions: {},
    });
  });
});
