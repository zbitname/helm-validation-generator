/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';
import { parse } from '../../src/lib/parse-yaml';
import { compact } from './helpers';

describe('YAML parse', () => {
  it('empty input', () => {
    const content = '';
    const res = parse(content);
    expect(res).to.be.deep.equals([]);
  });

  it('prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();

    expect(compact(chartItem)).to.deep.equals({
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
            { type: 'string', values: [ 'val1' ], path: '.prop8[0]', pathTemplate: '.prop8[]' },
            { type: 'number', values: [ 234 ], path: '.prop8[1]', pathTemplate: '.prop8[]' },
            { type: 'number', values: [ 234.345 ], path: '.prop8[2]', pathTemplate: '.prop8[]' },
            { type: 'boolean', values: [ true ], path: '.prop8[3]', pathTemplate: '.prop8[]' },
            { type: 'null', values: [ null ], path: '.prop8[4]', pathTemplate: '.prop8[]' },
            { type: 'array', values: [], children: [], path: '.prop8[5]', pathTemplate: '.prop8[]' },
            { type: 'object', values: [], children: [], path: '.prop8[6]', pathTemplate: '.prop8[]' },
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

  it('root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();
    expect(compact(chartItem)).to.deep.equals({
      type: 'array',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { type: 'string', values: [ 'item1' ], path: '[0]', pathTemplate: '[]' },
        { type: 'string', values: [ 'item2' ], path: '[1]', pathTemplate: '[]' },
        { type: 'string', values: [ 'item3' ], path: '[2]', pathTemplate: '[]' },
      ],
    });
  });

  it('mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();
    expect(compact(chartItem)).to.deep.equals({
      type: 'array',
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { type: 'null', values: [ null ], path: '[0]', pathTemplate: '[]' },
        { type: 'number', values: [ 123 ], path: '[1]', pathTemplate: '[]' },
        { type: 'number', values: [ 123.456 ], path: '[2]', pathTemplate: '[]' },
        { type: 'boolean', values: [ true ], path: '[3]', pathTemplate: '[]' },
        { type: 'string', values: [ 'some string' ], path: '[4]', pathTemplate: '[]' },
        { type: 'array', values: [], children: [], path: '[5]', pathTemplate: '[]' },
        { type: 'object', values: [], children: [], path: '[6]', pathTemplate: '[]' },
      ],
    });
  });

  it('simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();

    expect(compact(chartItem)).to.deep.equals({
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
            pathTemplate: '.items[]',
            children: [
              {
                prop: 'name',
                type: 'string',
                values: [ 'test name' ],
                comment: 'begin of array',
                path: '.items[0].name',
                pathTemplate: '.items[].name',
              },
              {
                prop: 'value',
                type: 'string',
                values: [ 'test value' ],
                comment: 'some comment #1',
                path: '.items[0].value',
                pathTemplate: '.items[].value',
              },
              {
                prop: 'description',
                type: 'string',
                values: [ 'test description' ],
                path: '.items[0].description',
                pathTemplate: '.items[].description',
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
              pathTemplate: '.elements[]',
            },
            { type: 'string', values: [ 'element#2' ], path: '.elements[1]', pathTemplate: '.elements[]' },
            { type: 'string', values: [ 'element#3' ], path: '.elements[2]', pathTemplate: '.elements[]' },
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
});
