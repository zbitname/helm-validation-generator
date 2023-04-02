/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { parse } from '../src/parse-yaml';
import { expect } from 'chai';
import { flatten } from '../src/flatten';
import { operationCompiler } from '../src/operation-compiler';
import { ControlCommentRepo } from '../src/classes/ControlCommentRepo';
import { buildSchema } from '../src/schema-builder';
import { RefControlComment } from '../src/control-comments/ref';
import { compact } from '../src/compact';
import { prune } from './helpers';

describe('Compact schema', () => {
  it('file=different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems));

    expect(prune(schema)).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        prop1: {
          type: 'object',
          properties: {
            num: { type: 'number' },
            str: { type: 'string' },
            bool: { type: 'boolean' },
            null: { type: 'null' },
            arr: {
              type: 'array',
              items: { type: [ 'number', 'string', 'boolean', 'null' ] },
            },
            obj: {
              type: 'object',
              properties: {
                subnum: { type: 'number' },
                substr: { type: 'string' },
                subbool: { type: 'boolean' },
                subnull: { type: 'null' },
              },
              required: [ 'subnum', 'substr', 'subbool', 'subnull' ],
              additionalProperties: false,
            },
          },
          required: [ 'num', 'str', 'bool', 'null', 'arr', 'obj' ],
          additionalProperties: false,
        },
      },
      required: [ 'prop1' ],
      additionalProperties: false,
      $defs: {},
    });
  });

  it('file=1-lvl-array-with-scalars-twice.yaml', () => {
    const content = readFileSync(`${__dirname}/files/1-lvl-array-with-scalars-twice.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems));

    expect(prune(schema)).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'array',
      items: { type: [ 'boolean', 'string', 'number', 'null' ] },
      $defs: {},
    });
  });

  it('file=mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false,
          },
          { type: [ 'null', 'number', 'boolean', 'string', 'array' ] },
        ],
      },
    });
  });

  it('file=prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'object',
      properties: {
        prop1: { type: 'string' },
        prop2: { type: 'number' },
        prop3: { type: 'number' },
        prop4: { type: 'boolean' },
        prop5: { type: 'null' },
        prop6: { type: 'array' },
        prop7: {
          type: 'object',
          properties: {},
          required: [],
          additionalProperties: false,
        },
        prop8: {
          type: 'array',
          items: {
            oneOf: [{
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            },
            {
              type: [ 'string', 'number', 'boolean', 'null', 'array' ],
            }],
          },
        },
        prop9: {
          type: 'object',
          properties: {
            subprop1: { type: 'string' },
            subprop2: { type: 'number' },
            subprop3: { type: 'number' },
            subprop4: { type: 'boolean' },
            subprop5: { type: 'null' },
            subprop6: { type: 'array' },
            subprop7: {
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            },
          },
          required: [ 'subprop1', 'subprop2', 'subprop3', 'subprop4', 'subprop5', 'subprop6', 'subprop7' ],
          additionalProperties: false,
        },
      },
      required: [ 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9' ],
      additionalProperties: false,
    });
  });

  it('file=root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('file=simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems, {
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
    }));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {
        ItemArray: {
          type: 'array',
          items: {
            oneOf: [{
              type: 'object',
              properties: {
                name: { oneOf: [ { type: 'string' } ] },
                value: { oneOf: [ { type: 'string' } ] },
                description: { oneOf: [ { type: 'string' } ] },
              },
              required: [ 'name', 'value', 'description' ],
              additionalProperties: false,
            }],
          },
        },
        Elements: {
          type: 'array',
          items: { oneOf: [ { type: 'string' } ] },
        }
      },
      type: 'object',
      properties: {
        someProp: { type: 'string' },
        somePropWithComment: { type: 'string' },
        items: { $ref: '#/$defs/ItemArray' },
        elements: { $ref: '#/$defs/Elements' },
        props: {
          type: 'object',
          properties: {
            p1: { type: 'string' },
            p2: { type: 'string' },
            p3: { type: 'string' },
          },
          required: [ 'p1', 'p2', 'p3' ],
          additionalProperties: false,
        }
      },
      required: [ 'someProp', 'somePropWithComment', 'items', 'elements', 'props' ],
      additionalProperties: false,
    });
  });

  it('file=issue-dot-notationed-keys.yaml', () => {
    const content = readFileSync(`${__dirname}/files/issue-dot-notationed-keys.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems, {}));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'object',
      properties: {
        ingress: {
          type: 'object',
          properties: {
            annotations: {
              type: 'object',
              properties: {
                'kubernetes.io/ingress.class': { type: 'string' },
                'nginx.ingress.kubernetes.io/proxy-body-size': { type: 'string' },
                'nginx.ingress.kubernetes.io/proxy-read-timeout': { type: 'string' },
                'nginx.ingress.kubernetes.io/proxy-send-timeout': { type: 'string' },
                'nginx.ingress.kubernetes.io/limit-rps': { type: 'string' },
                'nginx.ingress.kubernetes.io/limit-rpm': { type: 'string' },
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
            },
          },
          required: [ 'annotations' ],
          additionalProperties: false,
        },
      },
      required: [ 'ingress' ],
      additionalProperties: false,
    });
  });

  it('file=array-similar-objects.yaml', () => {
    const content = readFileSync(`${__dirname}/files/array-similar-objects.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems, {}));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'object',
      properties: {
        some: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              if: {
                type: 'object',
                properties: {
                  args: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                    },
                    required: [ 'status' ],
                    additionalProperties: false,
                  }
                },
                required: [ 'args' ],
                additionalProperties: false,
              },
              then: {
                type: 'array',
                items: { type: 'string' },
              }
            },
            required: [ 'if', 'then' ],
            additionalProperties: false,
          },
        },
      },
      required: [ 'some' ],
      additionalProperties: false,
    });
  });

  it('file=array-different-objects.yaml', () => {
    const content = readFileSync(`${__dirname}/files/array-different-objects.yaml`).toString();
    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const res = parse(content);
    const flat = flatten([], res[0].getDocumentItem());
    const flatCompiledItems = operationCompiler(flat, controlCommentRepo, {
      additionalProperties: false,
    });
    const schema = compact(buildSchema(flatCompiledItems, {}));

    expect(schema).to.deep.equals({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $defs: {},
      type: 'object',
      properties: {
        some: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
              bar: { type: 'string' },
            },
            required: [ 'bar' ],
            additionalProperties: false,
          },
        },
      },
      required: [ 'some' ],
      additionalProperties: false,
    });
  });
});
