/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../../src/lib/parse-yaml';
import { flatten } from '../../src/lib/flatten';
import { operationFiller } from '../../src/lib/operation-filler';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { SkipControlComment } from '../../src/lib/control-comments/skip';

describe('Operator filler', () => {
  describe('file=different-types-in-one-item.yaml', () => {
    const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('skip', SkipControlComment);

    const variants = [{
      path: '.prop1',
      operator: 'skip',
      index: 1,
      replaceOf: /^prop1:/m,
      replaceTo: 'prop1: # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.num',
      operator: 'skip',
      index: 2,
      replaceOf: /^\s{2}num: 123\.456/m,
      replaceTo: '  num: 123.456 # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.str',
      operator: 'skip',
      index: 3,
      replaceOf: /^\s{2}str: some string/m,
      replaceTo: '  str: some string # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.bool',
      operator: 'skip',
      index: 4,
      replaceOf: /^\s{2}bool: false/m,
      replaceTo: '  bool: false # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.null',
      operator: 'skip',
      index: 5,
      replaceOf: /^\s{2}null: null/m,
      replaceTo: '  null: null # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.arr',
      operator: 'skip',
      index: 6,
      replaceOf: /^\s{2}arr:/m,
      replaceTo: '  arr: # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.arr[0]',
      operator: 'skip',
      index: 7,
      replaceOf: /^\s{4}- 123\.456/m,
      replaceTo: '    - 123.456 # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.arr[1]',
      operator: 'skip',
      index: 8,
      replaceOf: /^\s{4}- some string/m,
      replaceTo: '    - some string # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.arr[2]',
      operator: 'skip',
      index: 9,
      replaceOf: /^\s{4}- false/m,
      replaceTo: '    - false # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.arr[3]',
      operator: 'skip',
      index: 10,
      replaceOf: /^\s{4}- null/m,
      replaceTo: '    - null # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.obj',
      operator: 'skip',
      index: 11,
      replaceOf: /^\s{2}obj:/m,
      replaceTo: '  obj: # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.obj.subnum',
      operator: 'skip',
      index: 12,
      replaceOf: /^\s{4}subnum: 123\.456/m,
      replaceTo: '    subnum: 123.456 # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.obj.substr',
      operator: 'skip',
      index: 13,
      replaceOf: /^\s{4}substr: some string/m,
      replaceTo: '    substr: some string # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.obj.subbool',
      operator: 'skip',
      index: 14,
      replaceOf: /^\s{4}subbool: false/m,
      replaceTo: '    subbool: false # schema: skip',
      operations: [ { skip: true } ],
    }, {
      path: '.prop1.obj.subnull',
      operator: 'skip',
      index: 15,
      replaceOf: /^\s{4}subnull: null/m,
      replaceTo: '    subnull: null # schema: skip',
      operations: [ { skip: true } ],
    }];

    for (const variant of variants) {
      it(`path: "${variant.path}", operator: "${variant.operator}"`, () => {
        const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
        const res = parse(content);
        const flat = flatten([], res[0].getChartItem());
        const flatWithOperators = operationFiller(flat, controlCommentRepo);

        expect(flatWithOperators[variant.index]).to.have.property('options');
        expect(flatWithOperators[variant.index].path).to.be.equals(variant.path);

        for (const op of variant.operations) {
          expect(flatWithOperators[variant.index].operations).to.include.deep.contains(op);
        }

        for (let i = 0; i < flatWithOperators.length; i++) {
          if (i === variant.index) continue;
          // eslint-disable-next-line no-unused-expressions
          expect(flatWithOperators[i].operations).to.be.empty;
        }
      });
    }
  });


});
