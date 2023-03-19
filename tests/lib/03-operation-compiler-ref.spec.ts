/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../../src/lib/parse-yaml';
import { flatten } from '../../src/lib/flatten';
import { operationCompiler } from '../../src/lib/operation-compiler';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { RefControlComment } from '../../src/lib/control-comments/ref';

describe('Operation compiler (ref)', () => {
  describe('file=different-types-in-one-item.yaml', () => {
    const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('ref', RefControlComment);

    const variants = [{
      path: '.prop1',
      replaceOf: /^prop1:/m,
      replaceTo: 'prop1: # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.num',
      replaceOf: /^\s{2}num: 123\.456/m,
      replaceTo: '  num: 123.456 # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.str',
      replaceOf: /^\s{2}str: some string/m,
      replaceTo: '  str: some string # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.bool',
      replaceOf: /^\s{2}bool: false/m,
      replaceTo: '  bool: false # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.null',
      replaceOf: /^\s{2}null: null/m,
      replaceTo: '  null: null # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.arr',
      replaceOf: /^\s{2}arr:/m,
      replaceTo: '  arr: # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.arr[0]',
      replaceOf: /^\s{4}- 123\.456/m,
      replaceTo: '    - 123.456 # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.arr[1]',
      replaceOf: /^\s{4}- some string/m,
      replaceTo: '    - some string # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.arr[2]',
      replaceOf: /^\s{4}- false/m,
      replaceTo: '    - false # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.arr[3]',
      replaceOf: /^\s{4}- null/m,
      replaceTo: '    - null # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.obj',
      replaceOf: /^\s{2}obj:/m,
      replaceTo: '  obj: # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.obj.subnum',
      replaceOf: /^\s{4}subnum: 123\.456/m,
      replaceTo: '    subnum: 123.456 # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.obj.substr',
      replaceOf: /^\s{4}substr: some string/m,
      replaceTo: '    substr: some string # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.obj.subbool',
      replaceOf: /^\s{4}subbool: false/m,
      replaceTo: '    subbool: false # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }, {
      path: '.prop1.obj.subnull',
      replaceOf: /^\s{4}subnull: null/m,
      replaceTo: '    subnull: null # schema: ref(Model)',
      expectedSchemaItem: { $ref: '#/$defs/Model' },
    }];

    for (const variant of variants) {
      it(`path: "${variant.path}"`, () => {
        const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
        const res = parse(content);
        const flat = flatten([], res[0].getChartItem());
        const flatCompiledItems = operationCompiler(flat, controlCommentRepo);

        expect(flatCompiledItems).to.be.an('array');

        for (const item of flatCompiledItems) {
          if (item.path === variant.path) {
            expect(item.precompiledSchemaItem).to.deep.equals(variant.expectedSchemaItem);
          } else {
            expect(item.precompiledSchemaItem).to.not.deep.equals(variant.expectedSchemaItem);
          }
        }
      });
    }
  });
});
