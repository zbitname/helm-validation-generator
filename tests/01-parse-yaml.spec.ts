/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';
import { parse } from '../src/parse-yaml';
import { compact } from './helpers';

describe('YAML parse', () => {
  it('empty input', () => {
    const content = '';
    const res = parse(content);
    expect(res).to.be.deep.equals([]);
  });

  it('file=prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const res = parse(content);
    const documentItem = res[0].getDocumentItem();

    expect(compact(documentItem)).to.deep.equals({
      type: 'object',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { type: 'string', prop: 'prop1', values: [ 'some string' ], path: '.prop1', pathTemplate: '.prop1' },
        { type: 'number', prop: 'prop2', values: [ 123 ], path: '.prop2', pathTemplate: '.prop2' },
        { type: 'number', prop: 'prop3', values: [ 123.456 ], path: '.prop3',  pathTemplate: '.prop3' },
        { type: 'boolean', prop: 'prop4', values: [ true ], path: '.prop4', pathTemplate: '.prop4' },
        { type: 'null', prop: 'prop5', values: [ null ], path: '.prop5', pathTemplate: '.prop5' },
        { type: 'array', prop: 'prop6', values: [], children: [], path: '.prop6', pathTemplate: '.prop6' },
        { type: 'object', prop: 'prop7', values: [], children: [], path: '.prop7', pathTemplate: '.prop7' },
        {
          type: 'array',
          prop: 'prop8',
          values: [],
          path: '.prop8',
          pathTemplate: '.prop8',
          children: [
            { type: 'string', values: [ 'val1' ], path: '.prop8[0]', pathTemplate: '.prop8.[]' },
            { type: 'number', values: [ 234 ], path: '.prop8[1]', pathTemplate: '.prop8.[]' },
            { type: 'number', values: [ 234.345 ], path: '.prop8[2]', pathTemplate: '.prop8.[]' },
            { type: 'boolean', values: [ true ], path: '.prop8[3]', pathTemplate: '.prop8.[]' },
            { type: 'null', values: [ null ], path: '.prop8[4]', pathTemplate: '.prop8.[]' },
            { type: 'array', values: [], children: [], path: '.prop8[5]', pathTemplate: '.prop8.[]' },
            { type: 'object', values: [], children: [], path: '.prop8[6]', pathTemplate: '.prop8.[]' },
          ],
        },
        {
          type: 'object',
          prop: 'prop9',
          values: [],
          path: '.prop9',
          pathTemplate: '.prop9',
          children: [
            {
              type: 'string',
              prop: 'subprop1',
              values: [ 'val1' ],
              path: '.prop9.subprop1',
              pathTemplate: '.prop9.subprop1',
            },
            {
              type: 'number',
              prop: 'subprop2',
              values: [ 234 ],
              path: '.prop9.subprop2',
              pathTemplate: '.prop9.subprop2',
            },
            {
              type: 'number',
              prop: 'subprop3',
              values: [ 234.345 ],
              path: '.prop9.subprop3',
              pathTemplate: '.prop9.subprop3',
            },
            {
              type: 'boolean',
              prop: 'subprop4',
              values: [ true ],
              path: '.prop9.subprop4',
              pathTemplate: '.prop9.subprop4',
            },
            {
              type: 'null',
              prop: 'subprop5',
              values: [ null ],
              path: '.prop9.subprop5',
              pathTemplate: '.prop9.subprop5',
            },
            {
              type: 'array',
              prop: 'subprop6',
              values: [],
              children: [], path: '.prop9.subprop6',
              pathTemplate: '.prop9.subprop6',
            },
            {
              type: 'object',
              prop: 'subprop7',
              values: [],
              children: [], path: '.prop9.subprop7',
              pathTemplate: '.prop9.subprop7',
            },
          ],
        },
      ],
    });
  });

  it('file=root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const res = parse(content);
    const documentItem = res[0].getDocumentItem();
    expect(compact(documentItem)).to.deep.equals({
      type: 'array',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { type: 'string', values: [ 'item1' ], path: '[0]', pathTemplate: '.[]' },
        { type: 'string', values: [ 'item2' ], path: '[1]', pathTemplate: '.[]' },
        { type: 'string', values: [ 'item3' ], path: '[2]', pathTemplate: '.[]' },
      ],
    });
  });

  it('file=mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content);
    const documentItem = res[0].getDocumentItem();
    expect(compact(documentItem)).to.deep.equals({
      type: 'array',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { type: 'null', values: [ null ], path: '[0]', pathTemplate: '.[]' },
        { type: 'number', values: [ 123 ], path: '[1]', pathTemplate: '.[]' },
        { type: 'number', values: [ 123.456 ], path: '[2]', pathTemplate: '.[]' },
        { type: 'boolean', values: [ true ], path: '[3]', pathTemplate: '.[]' },
        { type: 'string', values: [ 'some string' ], path: '[4]', pathTemplate: '.[]' },
        { type: 'array', values: [], children: [], path: '[5]', pathTemplate: '.[]' },
        { type: 'object', values: [], children: [], path: '[6]', pathTemplate: '.[]' },
      ],
    });
  });

  it('file=simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();

    expect(compact(documentItItem)).to.deep.equals({
      type: 'object',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { prop: 'someProp', type: 'string', values: [ 'val' ], path: '.someProp', pathTemplate: '.someProp' },
        {
          prop: 'somePropWithComment',
          type: 'string',
          values: [ 'val' ],
          comment: 'comment!!!',
          path: '.somePropWithComment',
          pathTemplate: '.somePropWithComment',
        },
        {
          prop: 'items',
          type: 'array',
          values: [],
          comment: 'schema: ref(ItemArray)',
          path: '.items',
          pathTemplate: '.items',
          options: [{
            args: [ 'ItemArray' ],
            name: 'ref',
          }],
          children: [{
            type: 'object',
            values: [],
            path: '.items[0]',
            pathTemplate: '.items.[]',
            children: [
              {
                prop: 'name',
                type: 'string',
                values: [ 'test name' ],
                comment: 'begin of array',
                path: '.items[0].name',
                pathTemplate: '.items.[].name',
              },
              {
                prop: 'value',
                type: 'string',
                values: [ 'test value' ],
                comment: 'some comment #1',
                path: '.items[0].value',
                pathTemplate: '.items.[].value',
              },
              {
                prop: 'description',
                type: 'string',
                values: [ 'test description' ],
                path: '.items[0].description',
                pathTemplate: '.items.[].description',
              },
            ],
          }],
        },
        {
          prop: 'elements',
          type: 'array',
          values: [],
          comment: 'schema: ref(Elements)',
          path: '.elements',
          pathTemplate: '.elements',
          options: [{
            args: [ 'Elements' ],
            name: 'ref',
          }],
          children: [
            {
              type: 'string',
              values: [ 'element#1' ],
              comment: 'some comment #2',
              path: '.elements[0]',
              pathTemplate: '.elements.[]',
            },
            { type: 'string', values: [ 'element#2' ], path: '.elements[1]', pathTemplate: '.elements.[]' },
            { type: 'string', values: [ 'element#3' ], path: '.elements[2]', pathTemplate: '.elements.[]' },
          ],
        },
        {
          prop: 'props',
          comment: 'some props',
          path: '.props',
          pathTemplate: '.props',
          children: [{
            prop: 'p1',
            type: 'string',
            values: [ 'val1' ],
            path: '.props.p1',
            pathTemplate: '.props.p1',
          },
          {
            prop: 'p2',
            type: 'string',
            values: [ 'val2' ],
            path: '.props.p2',
            pathTemplate: '.props.p2',
          },
          {
            prop: 'p3',
            type: 'string',
            values: [ 'val3' ],
            path: '.props.p3',
            pathTemplate: '.props.p3',
          }],
          type: 'object',
          values: [],
        },
      ],
    });
  });

  it('file=different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const res = parse(content);
    const documentItItem = res[0].getDocumentItem();

    expect(compact(documentItItem)).to.deep.equals({
      children: [
        {
          children: [
            {
              values: [ 123.456 ],
              type: 'number',
              path: '.prop1.num',
              pathTemplate: '.prop1.num',
              prop: 'num',
            },
            {
              values: [ 'some string' ],
              type: 'string',
              path: '.prop1.str',
              pathTemplate: '.prop1.str',
              prop: 'str',
            },
            {
              values: [ false ],
              type: 'boolean',
              path: '.prop1.bool',
              pathTemplate: '.prop1.bool',
              prop: 'bool',
            },
            {
              values: [ null ],
              type: 'null',
              path: '.prop1.null',
              pathTemplate: '.prop1.null',
              prop: 'null',
            },
            {
              children: [
                {
                  values: [ 123.456 ],
                  type: 'number',
                  path: '.prop1.arr[0]',
                  pathTemplate: '.prop1.arr.[]',
                },
                {
                  values: [ 'some string' ],
                  type: 'string',
                  path: '.prop1.arr[1]',
                  pathTemplate: '.prop1.arr.[]',
                },
                {
                  values: [ false ],
                  type: 'boolean',
                  path: '.prop1.arr[2]',
                  pathTemplate: '.prop1.arr.[]',
                },
                {
                  values: [ null ],
                  type: 'null',
                  path: '.prop1.arr[3]',
                  pathTemplate: '.prop1.arr.[]',
                }
              ],
              values: [],
              type: 'array',
              path: '.prop1.arr',
              pathTemplate: '.prop1.arr',
              prop: 'arr',
            },
            {
              children: [
                {
                  values: [ 123.456 ],
                  type: 'number',
                  path: '.prop1.obj.subnum',
                  pathTemplate: '.prop1.obj.subnum',
                  prop: 'subnum',
                },
                {
                  values: [ 'some string' ],
                  type: 'string',
                  path: '.prop1.obj.substr',
                  pathTemplate: '.prop1.obj.substr',
                  prop: 'substr',
                },
                {
                  values: [ false ],
                  type: 'boolean',
                  path: '.prop1.obj.subbool',
                  pathTemplate: '.prop1.obj.subbool',
                  prop: 'subbool',
                },
                {
                  values: [ null ],
                  type: 'null',
                  path: '.prop1.obj.subnull',
                  pathTemplate: '.prop1.obj.subnull',
                  prop: 'subnull',
                }
              ],
              values: [],
              type: 'object',
              path: '.prop1.obj',
              pathTemplate: '.prop1.obj',
              prop: 'obj',
            }
          ],
          values: [],
          type: 'object',
          path: '.prop1',
          pathTemplate: '.prop1',
          prop: 'prop1',
        }
      ],
      values: [],
      type: 'object',
      path: '',
      pathTemplate: '',
    });
  });
});
