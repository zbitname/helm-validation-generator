/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { parse } from '../src/parse-yaml';
import { expect } from 'chai';
import { flatten } from '../src/flatten';
import { compact } from './helpers';

describe('Flatten', () => {
  it('different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();
    const flatItems = flatten([], documentItItem);

    expect(compact(flatItems)).to.deep.equals([
      { path: '', pathTemplate: '', type: 'object', values: [] },
      { path: '.prop1', pathTemplate: '.prop1', type: 'object', values: [], prop: 'prop1' },
      { path: '.prop1.num', pathTemplate: '.prop1.num', type: 'number', values: [ 123.456 ], prop: 'num' },
      { path: '.prop1.str', pathTemplate: '.prop1.str', type: 'string', values: [ 'some string' ], prop: 'str' },
      { path: '.prop1.bool', pathTemplate: '.prop1.bool', type: 'boolean', values: [ false ], prop: 'bool' },
      { path: '.prop1.null', pathTemplate: '.prop1.null', type: 'null', values: [ null ], prop: 'null' },
      { path: '.prop1.arr', pathTemplate: '.prop1.arr', type: 'array', values: [], prop: 'arr' },
      { path: '.prop1.arr[0]', pathTemplate: '.prop1.arr.[]', type: 'number', values: [ 123.456 ] },
      { path: '.prop1.arr[1]', pathTemplate: '.prop1.arr.[]', type: 'string', values: [ 'some string' ] },
      { path: '.prop1.arr[2]', pathTemplate: '.prop1.arr.[]', type: 'boolean', values: [ false ] },
      { path: '.prop1.arr[3]', pathTemplate: '.prop1.arr.[]', type: 'null', values: [ null ] },
      { path: '.prop1.obj', pathTemplate: '.prop1.obj', type: 'object', values: [], prop: 'obj' },
      { path: '.prop1.obj.subnum', pathTemplate: '.prop1.obj.subnum', type: 'number', values: [ 123.456 ], prop: 'subnum' },
      { path: '.prop1.obj.substr', pathTemplate: '.prop1.obj.substr', type: 'string', values: [ 'some string' ], prop: 'substr' },
      { path: '.prop1.obj.subbool', pathTemplate: '.prop1.obj.subbool', type: 'boolean', values: [ false ], prop: 'subbool' },
      { path: '.prop1.obj.subnull', pathTemplate: '.prop1.obj.subnull', type: 'null', values: [ null ], prop: 'subnull' },
    ]);
  });

  it('mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();
    const flatItems = flatten([], documentItItem);

    expect(compact(flatItems)).to.deep.equals([
      { path: '', pathTemplate: '', type: 'array', values: [] },
      { path: '[0]', pathTemplate: '.[]', type: 'null', values: [ null ] },
      { path: '[1]', pathTemplate: '.[]', type: 'number', values: [ 123 ] },
      { path: '[2]', pathTemplate: '.[]', type: 'number', values: [ 123.456 ] },
      { path: '[3]', pathTemplate: '.[]', type: 'boolean', values: [ true ] },
      { path: '[4]', pathTemplate: '.[]', type: 'string', values: [ 'some string' ] },
      { path: '[5]', pathTemplate: '.[]', type: 'array', values: [] },
      { path: '[6]', pathTemplate: '.[]', type: 'object', values: [] },
    ]);
  });

  it('prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();
    const flatItems = flatten([], documentItItem);

    expect(compact(flatItems)).to.deep.equals([
      { path: '', pathTemplate: '', type: 'object', values: [] },
      { path: '.prop1', pathTemplate: '.prop1', prop: 'prop1', type: 'string', values: [ 'some string' ] },
      { path: '.prop2', pathTemplate: '.prop2', prop: 'prop2', type: 'number', values: [ 123 ] },
      { path: '.prop3', pathTemplate: '.prop3', prop: 'prop3', type: 'number', values: [ 123.456 ] },
      { path: '.prop4', pathTemplate: '.prop4', prop: 'prop4', type: 'boolean', values: [ true ] },
      { path: '.prop5', pathTemplate: '.prop5', prop: 'prop5', type: 'null', values: [ null ] },
      { path: '.prop6', pathTemplate: '.prop6', prop: 'prop6', type: 'array', values: [] },
      { path: '.prop7', pathTemplate: '.prop7', prop: 'prop7', type: 'object', values: [] },
      { path: '.prop8', pathTemplate: '.prop8', prop: 'prop8', type: 'array', values: [] },
      { path: '.prop8[0]', pathTemplate: '.prop8.[]', type: 'string', values: [ 'val1' ] },
      { path: '.prop8[1]', pathTemplate: '.prop8.[]', type: 'number', values: [ 234 ] },
      { path: '.prop8[2]', pathTemplate: '.prop8.[]', type: 'number', values: [ 234.345 ] },
      { path: '.prop8[3]', pathTemplate: '.prop8.[]', type: 'boolean', values: [ true ] },
      { path: '.prop8[4]', pathTemplate: '.prop8.[]', type: 'null', values: [ null ] },
      { path: '.prop8[5]', pathTemplate: '.prop8.[]', type: 'array', values: [] },
      { path: '.prop8[6]', pathTemplate: '.prop8.[]', type: 'object', values: [] },
      { path: '.prop9', pathTemplate: '.prop9', prop: 'prop9', type: 'object', values: [] },
      { path: '.prop9.subprop1', pathTemplate: '.prop9.subprop1', prop: 'subprop1', type: 'string', values: [ 'val1' ] },
      { path: '.prop9.subprop2', pathTemplate: '.prop9.subprop2', prop: 'subprop2', type: 'number', values: [ 234 ] },
      { path: '.prop9.subprop3', pathTemplate: '.prop9.subprop3', prop: 'subprop3', type: 'number', values: [ 234.345 ] },
      { path: '.prop9.subprop4', pathTemplate: '.prop9.subprop4', prop: 'subprop4', type: 'boolean', values: [ true ] },
      { path: '.prop9.subprop5', pathTemplate: '.prop9.subprop5', prop: 'subprop5', type: 'null', values: [ null ] },
      { path: '.prop9.subprop6', pathTemplate: '.prop9.subprop6', prop: 'subprop6', type: 'array', values: [] },
      { path: '.prop9.subprop7', pathTemplate: '.prop9.subprop7', prop: 'subprop7', type: 'object', values: [] },
    ]);
  });

  it('root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();
    const flatItems = flatten([], documentItItem);

    expect(compact(flatItems)).to.deep.equals([
      { path: '', pathTemplate: '', type: 'array', values: [] },
      { path: '[0]', pathTemplate: '.[]', type: 'string', values: [ 'item1' ] },
      { path: '[1]', pathTemplate: '.[]', type: 'string', values: [ 'item2' ] },
      { path: '[2]', pathTemplate: '.[]', type: 'string', values: [ 'item3' ] },
    ]);
  });

  it('simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content);
    const documentItem = res[0].getDocumentItem();
    const flatItems = flatten([], documentItem);

    expect(compact(flatItems)).to.deep.equals([
      { path: '', pathTemplate: '', type: 'object', values: [] },
      { path: '.someProp', pathTemplate: '.someProp', prop: 'someProp', type: 'string', values: [ 'val' ] },
      {
        path: '.somePropWithComment',
        pathTemplate: '.somePropWithComment',
        prop: 'somePropWithComment',
        type: 'string',
        values: [ 'val' ],
        comment: 'comment!!!',
      },
      {
        path: '.items',
        pathTemplate: '.items',
        prop: 'items',
        type: 'array',
        values: [],
        comment: 'schema: ref(ItemArray)',
        options: [{
          args: [ 'ItemArray' ],
          name: 'ref',
        }],
      },
      { path: '.items[0]', pathTemplate: '.items.[]', type: 'object', values: [] },
      {
        path: '.items[0].name',
        pathTemplate: '.items.[].name',
        prop: 'name',
        type: 'string',
        values: [ 'test name' ],
        comment: 'begin of array',
      },
      {
        path: '.items[0].value',
        pathTemplate: '.items.[].value',
        prop: 'value',
        type: 'string',
        values: [ 'test value' ],
        comment: 'some comment #1',
      },
      {
        path: '.items[0].description',
        pathTemplate: '.items.[].description',
        prop: 'description',
        type: 'string',
        values: [ 'test description' ],
      },
      {
        path: '.elements',
        pathTemplate: '.elements',
        prop: 'elements',
        type: 'array',
        values: [],
        comment: 'schema: ref(Elements)',
        options: [{
          args: [ 'Elements' ],
          name: 'ref',
        }],
      },
      { path: '.elements[0]', pathTemplate: '.elements.[]', type: 'string', values: [ 'element#1' ], comment: 'some comment #2' },
      { path: '.elements[1]', pathTemplate: '.elements.[]', type: 'string', values: [ 'element#2' ] },
      { path: '.elements[2]', pathTemplate: '.elements.[]', type: 'string', values: [ 'element#3' ] },
      { path: '.props', pathTemplate: '.props', prop: 'props', type: 'object', values: [], comment: 'some props' },
      { path: '.props.p1', pathTemplate: '.props.p1', prop: 'p1', type: 'string', values: [ 'val1' ] },
      { path: '.props.p2', pathTemplate: '.props.p2', prop: 'p2', type: 'string', values: [ 'val2' ] },
      { path: '.props.p3', pathTemplate: '.props.p3', prop: 'p3', type: 'string', values: [ 'val3' ] },
    ]);
  });

  describe('Check options / file=different-types-in-one-item.yaml', () => {
    const BASE_CONTENT = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();

    const variants = [{
      path: '.prop1',
      operator: 'skip',
      index: 1,
      replaceOf: /^prop1:/m,
      replaceTo: 'prop1: # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.num',
      operator: 'skip',
      index: 2,
      replaceOf: /^\s{2}num: 123\.456/m,
      replaceTo: '  num: 123.456 # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.str',
      operator: 'skip',
      index: 3,
      replaceOf: /^\s{2}str: some string/m,
      replaceTo: '  str: some string # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.bool',
      operator: 'skip',
      index: 4,
      replaceOf: /^\s{2}bool: false/m,
      replaceTo: '  bool: false # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.null',
      operator: 'skip',
      index: 5,
      replaceOf: /^\s{2}null: null/m,
      replaceTo: '  null: null # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.arr',
      operator: 'skip',
      index: 6,
      replaceOf: /^\s{2}arr:/m,
      replaceTo: '  arr: # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.arr[0]',
      operator: 'skip',
      index: 7,
      replaceOf: /^\s{4}- 123\.456/m,
      replaceTo: '    - 123.456 # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.arr[1]',
      operator: 'skip',
      index: 8,
      replaceOf: /^\s{4}- some string/m,
      replaceTo: '    - some string # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.arr[2]',
      operator: 'skip',
      index: 9,
      replaceOf: /^\s{4}- false/m,
      replaceTo: '    - false # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.arr[3]',
      operator: 'skip',
      index: 10,
      replaceOf: /^\s{4}- null/m,
      replaceTo: '    - null # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.obj',
      operator: 'skip',
      index: 11,
      replaceOf: /^\s{2}obj:/m,
      replaceTo: '  obj: # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.obj.subnum',
      operator: 'skip',
      index: 12,
      replaceOf: /^\s{4}subnum: 123\.456/m,
      replaceTo: '    subnum: 123.456 # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.obj.substr',
      operator: 'skip',
      index: 13,
      replaceOf: /^\s{4}substr: some string/m,
      replaceTo: '    substr: some string # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.obj.subbool',
      operator: 'skip',
      index: 14,
      replaceOf: /^\s{4}subbool: false/m,
      replaceTo: '    subbool: false # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }, {
      path: '.prop1.obj.subnull',
      operator: 'skip',
      index: 15,
      replaceOf: /^\s{4}subnull: null/m,
      replaceTo: '    subnull: null # schema: skip',
      options: [ { name: 'skip', args: [] } ],
    }];

    for (const variant of variants) {
      it(`path: "${variant.path}", operator: "${variant.operator}"`, () => {
        const content = BASE_CONTENT.replace(variant.replaceOf, variant.replaceTo);
        const res = parse(content);
        const flat = flatten([], res[0].getDocumentItem());

        expect(flat[variant.index]).to.have.property('options');
        expect(flat[variant.index].path).to.be.equals(variant.path);

        for (const option of variant.options) {
          expect(flat[variant.index].options).to.include.deep.contains(option);
        }

        for (let i = 0; i < flat.length; i++) {
          if (i === variant.index) continue;
          expect(compact(flat[i])).to.not.have.property('options');
        }
      });
    }
  });
});
