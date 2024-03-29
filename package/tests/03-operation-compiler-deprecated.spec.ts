/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../src/parse-yaml';
import { flatten } from '../src/flatten';
import { operationCompiler } from '../src/operation-compiler';
import { ControlCommentRepo } from '../src/classes/ControlCommentRepo';
import { DeprecatedControlComment } from '../src/control-comments/deprecated';

describe('Operation compiler (deprecated)', () => {
  describe('Without comment', () => {
    describe('file=different-types-in-one-item.yaml', () => {
      const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

      const controlCommentRepo = new ControlCommentRepo();
      controlCommentRepo.add('deprecated', DeprecatedControlComment);

      const variants = [{
        path: '.prop1',
        replaceOf: /^prop1:/m,
        replaceTo: 'prop1: # schema: deprecated',
      }, {
        path: '.prop1.num',
        replaceOf: /^\s{2}num: 123\.456/m,
        replaceTo: '  num: 123.456 # schema: deprecated',
      }, {
        path: '.prop1.str',
        replaceOf: /^\s{2}str: some string/m,
        replaceTo: '  str: some string # schema: deprecated',
      }, {
        path: '.prop1.bool',
        replaceOf: /^\s{2}bool: false/m,
        replaceTo: '  bool: false # schema: deprecated',
      }, {
        path: '.prop1.null',
        replaceOf: /^\s{2}null: null/m,
        replaceTo: '  null: null # schema: deprecated',
      }, {
        path: '.prop1.arr',
        replaceOf: /^\s{2}arr:/m,
        replaceTo: '  arr: # schema: deprecated',
      }, {
        path: '.prop1.arr[0]',
        replaceOf: /^\s{4}- 123\.456/m,
        replaceTo: '    - 123.456 # schema: deprecated',
      }, {
        path: '.prop1.arr[1]',
        replaceOf: /^\s{4}- some string/m,
        replaceTo: '    - some string # schema: deprecated',
      }, {
        path: '.prop1.arr[2]',
        replaceOf: /^\s{4}- false/m,
        replaceTo: '    - false # schema: deprecated',
      }, {
        path: '.prop1.arr[3]',
        replaceOf: /^\s{4}- null/m,
        replaceTo: '    - null # schema: deprecated',
      }, {
        path: '.prop1.obj',
        replaceOf: /^\s{2}obj:/m,
        replaceTo: '  obj: # schema: deprecated',
      }, {
        path: '.prop1.obj.subnum',
        replaceOf: /^\s{4}subnum: 123\.456/m,
        replaceTo: '    subnum: 123.456 # schema: deprecated',
      }, {
        path: '.prop1.obj.substr',
        replaceOf: /^\s{4}substr: some string/m,
        replaceTo: '    substr: some string # schema: deprecated',
      }, {
        path: '.prop1.obj.subbool',
        replaceOf: /^\s{4}subbool: false/m,
        replaceTo: '    subbool: false # schema: deprecated',
      }, {
        path: '.prop1.obj.subnull',
        replaceOf: /^\s{4}subnull: null/m,
        replaceTo: '    subnull: null # schema: deprecated',
      }];

      for (const variant of variants) {
        it(`path: "${variant.path}"`, () => {
          const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
          const res = parse(content);
          const flat = flatten([], res[0].getDocumentItem());
          const flatCompiledItems = operationCompiler(flat, controlCommentRepo);

          expect(flatCompiledItems).to.be.an('array');

          const caseElement = flatCompiledItems.find(i => i.path === variant.path);

          expect(caseElement).to.have.property('precompiledSchemaItem');
          expect(caseElement!.precompiledSchemaItem).to.have.property('deprecated');
          expect(caseElement!.precompiledSchemaItem.deprecated).to.be.equals(true);

          const otherElements = flatCompiledItems.filter(i => i.path !== variant.path);

          for (const el of otherElements) {
            expect(el).to.have.property('precompiledSchemaItem');
            expect(el.precompiledSchemaItem).to.not.have.property('deprecated');
          }
        });
      }
    });
  });

  describe('With comment', () => {
    describe('file=different-types-in-one-item.yaml', () => {
      const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

      const controlCommentRepo = new ControlCommentRepo();
      controlCommentRepo.add('deprecated', DeprecatedControlComment);

      const variants = [{
        path: '.prop1',
        replaceOf: /^prop1:/m,
        replaceTo: 'prop1: # schema: deprecated(some text)',
      }, {
        path: '.prop1.num',
        replaceOf: /^\s{2}num: 123\.456/m,
        replaceTo: '  num: 123.456 # schema: deprecated(some text)',
      }, {
        path: '.prop1.str',
        replaceOf: /^\s{2}str: some string/m,
        replaceTo: '  str: some string # schema: deprecated(some text)',
      }, {
        path: '.prop1.bool',
        replaceOf: /^\s{2}bool: false/m,
        replaceTo: '  bool: false # schema: deprecated(some text)',
      }, {
        path: '.prop1.null',
        replaceOf: /^\s{2}null: null/m,
        replaceTo: '  null: null # schema: deprecated(some text)',
      }, {
        path: '.prop1.arr',
        replaceOf: /^\s{2}arr:/m,
        replaceTo: '  arr: # schema: deprecated(some text)',
      }, {
        path: '.prop1.arr[0]',
        replaceOf: /^\s{4}- 123\.456/m,
        replaceTo: '    - 123.456 # schema: deprecated(some text)',
      }, {
        path: '.prop1.arr[1]',
        replaceOf: /^\s{4}- some string/m,
        replaceTo: '    - some string # schema: deprecated(some text)',
      }, {
        path: '.prop1.arr[2]',
        replaceOf: /^\s{4}- false/m,
        replaceTo: '    - false # schema: deprecated(some text)',
      }, {
        path: '.prop1.arr[3]',
        replaceOf: /^\s{4}- null/m,
        replaceTo: '    - null # schema: deprecated(some text)',
      }, {
        path: '.prop1.obj',
        replaceOf: /^\s{2}obj:/m,
        replaceTo: '  obj: # schema: deprecated(some text)',
      }, {
        path: '.prop1.obj.subnum',
        replaceOf: /^\s{4}subnum: 123\.456/m,
        replaceTo: '    subnum: 123.456 # schema: deprecated(some text)',
      }, {
        path: '.prop1.obj.substr',
        replaceOf: /^\s{4}substr: some string/m,
        replaceTo: '    substr: some string # schema: deprecated(some text)',
      }, {
        path: '.prop1.obj.subbool',
        replaceOf: /^\s{4}subbool: false/m,
        replaceTo: '    subbool: false # schema: deprecated(some text)',
      }, {
        path: '.prop1.obj.subnull',
        replaceOf: /^\s{4}subnull: null/m,
        replaceTo: '    subnull: null # schema: deprecated(some text)',
      }];

      for (const variant of variants) {
        it(`path: "${variant.path}"`, () => {
          const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
          const res = parse(content);
          const flat = flatten([], res[0].getDocumentItem());
          const flatCompiledItems = operationCompiler(flat, controlCommentRepo);

          expect(flatCompiledItems).to.be.an('array');

          const caseElement = flatCompiledItems.find(i => i.path === variant.path);

          expect(caseElement).to.have.property('precompiledSchemaItem');
          expect(caseElement!.precompiledSchemaItem).to.have.property('deprecated');
          expect(caseElement!.precompiledSchemaItem).to.have.property('description');
          expect(caseElement!.precompiledSchemaItem.deprecated).to.be.equals(true);
          expect(caseElement!.precompiledSchemaItem.description).to.be.equals('some text');

          const otherElements = flatCompiledItems.filter(i => i.path !== variant.path);

          for (const el of otherElements) {
            expect(el).to.have.property('precompiledSchemaItem');
            expect(el.precompiledSchemaItem).to.not.have.property('deprecated');
          }
        });
      }
    });
  });
});
