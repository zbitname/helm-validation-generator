/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../src/parse-yaml';
import { flatten } from '../src/flatten';
import { operationCompiler } from '../src/operation-compiler';
import { ControlCommentRepo } from '../src/classes/ControlCommentRepo';
import { SkipControlComment } from '../src/control-comments/skip';

describe('Operation compiler (skip)', () => {
  describe('file=different-types-in-one-item.yaml', () => {
    const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

    const controlCommentRepo = new ControlCommentRepo();
    controlCommentRepo.add('skip', SkipControlComment);

    const variants = [{
      path: '.prop1',
      replaceOf: /^prop1:/m,
      replaceTo: 'prop1: # schema: skip',
      shouldNotContainsPaths: [
        '.prop1', '.prop1.num', '.prop1.str',
        '.prop1.bool', '.prop1.null', '.prop1.arr',
        '.prop1.arr[0]', '.prop1.arr[1]', '.prop1.arr[2]',
        '.prop1.arr[3]', '.prop1.obj', '.prop1.obj.subnum',
        '.prop1.obj.substr', '.prop1.obj.subbool', '.prop1.obj.subnull',
      ],
    }, {
      path: '.prop1.num',
      replaceOf: /^\s{2}num: 123\.456/m,
      replaceTo: '  num: 123.456 # schema: skip',
      shouldNotContainsPaths: [ '.prop1.num' ],
    }, {
      path: '.prop1.str',
      replaceOf: /^\s{2}str: some string/m,
      replaceTo: '  str: some string # schema: skip',
      shouldNotContainsPaths: [ '.prop1.str' ],
    }, {
      path: '.prop1.bool',
      replaceOf: /^\s{2}bool: false/m,
      replaceTo: '  bool: false # schema: skip',
      shouldNotContainsPaths: [ '.prop1.bool' ],
    }, {
      path: '.prop1.null',
      replaceOf: /^\s{2}null: null/m,
      replaceTo: '  null: null # schema: skip',
      shouldNotContainsPaths: [ '.prop1.null' ],
    }, {
      path: '.prop1.arr',
      replaceOf: /^\s{2}arr:/m,
      replaceTo: '  arr: # schema: skip',
      shouldNotContainsPaths: [ '.prop1.arr', '.prop1.arr[0]', '.prop1.arr[1]', '.prop1.arr[2]', '.prop1.arr[3]' ],
    }, {
      path: '.prop1.arr[0]',
      replaceOf: /^\s{4}- 123\.456/m,
      replaceTo: '    - 123.456 # schema: skip',
      shouldNotContainsPaths: [ '.prop1.arr[0]' ],
    }, {
      path: '.prop1.arr[1]',
      replaceOf: /^\s{4}- some string/m,
      replaceTo: '    - some string # schema: skip',
      shouldNotContainsPaths: [ '.prop1.arr[1]' ],
    }, {
      path: '.prop1.arr[2]',
      replaceOf: /^\s{4}- false/m,
      replaceTo: '    - false # schema: skip',
      shouldNotContainsPaths: [ '.prop1.arr[2]' ],
    }, {
      path: '.prop1.arr[3]',
      replaceOf: /^\s{4}- null/m,
      replaceTo: '    - null # schema: skip',
      shouldNotContainsPaths: [ '.prop1.arr[3]' ],
    }, {
      path: '.prop1.obj',
      replaceOf: /^\s{2}obj:/m,
      replaceTo: '  obj: # schema: skip',
      shouldNotContainsPaths: [ '.prop1.obj', '.prop1.obj.subnum', '.prop1.obj.substr', '.prop1.obj.subbool', '.prop1.obj.subnull' ],
    }, {
      path: '.prop1.obj.subnum',
      replaceOf: /^\s{4}subnum: 123\.456/m,
      replaceTo: '    subnum: 123.456 # schema: skip',
      shouldNotContainsPaths: [ '.prop1.obj.subnum' ],
    }, {
      path: '.prop1.obj.substr',
      replaceOf: /^\s{4}substr: some string/m,
      replaceTo: '    substr: some string # schema: skip',
      shouldNotContainsPaths: [ '.prop1.obj.substr' ],
    }, {
      path: '.prop1.obj.subbool',
      replaceOf: /^\s{4}subbool: false/m,
      replaceTo: '    subbool: false # schema: skip',
      shouldNotContainsPaths: [ '.prop1.obj.subbool' ],
    }, {
      path: '.prop1.obj.subnull',
      replaceOf: /^\s{4}subnull: null/m,
      replaceTo: '    subnull: null # schema: skip',
      shouldNotContainsPaths: [ '.prop1.obj.subnull' ],
    }];

    for (const variant of variants) {
      it(`path: "${variant.path}"`, () => {
        const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
        const res = parse(content);
        const flat = flatten([], res[0].getDocumentItem());
        const flatCompiledItems = operationCompiler(flat, controlCommentRepo);

        expect(flatCompiledItems).to.be.an('array');

        for (const path of variant.shouldNotContainsPaths) {
          expect(flatCompiledItems.map(i => i.path)).to.not.contains(path);
        }
      });
    }
  });
});
