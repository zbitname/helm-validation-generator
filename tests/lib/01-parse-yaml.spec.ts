/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';
import { parse } from '../../src/lib/yaml-to-schema';
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
      types: [ 'object' ],
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { types: [ 'string' ], prop: 'prop1', values: [ 'some string' ], path: '.prop1', pathTemplate: '.prop1' },
        { types: [ 'number' ], prop: 'prop2', values: [ 123 ], path: '.prop2', pathTemplate: '.prop2' },
        { types: [ 'number' ], prop: 'prop3', values: [ 123.456 ], path: '.prop3',  pathTemplate: '.prop3' },
        { types: [ 'boolean' ], prop: 'prop4', values: [ true ], path: '.prop4', pathTemplate: '.prop4' },
        { types: [ 'null' ], prop: 'prop5', values: [ null ], path: '.prop5', pathTemplate: '.prop5' },
        { types: [ 'array' ], prop: 'prop6', values: [], children: [], path: '.prop6', pathTemplate: '.prop6' },
        { types: [ 'object' ], prop: 'prop7', values: [], children: [], path: '.prop7', pathTemplate: '.prop7' },
        {
          types: [ 'array' ],
          prop: 'prop8',
          values: [],
          path: '.prop8',
          pathTemplate: '.prop8',
          children: [
            { types: [ 'string' ], values: [ 'val1' ], path: '.prop8[0]', pathTemplate: '.prop8[]' },
            { types: [ 'number' ], values: [ 234 ], path: '.prop8[1]', pathTemplate: '.prop8[]' },
            { types: [ 'number' ], values: [ 234.345 ], path: '.prop8[2]', pathTemplate: '.prop8[]' },
            { types: [ 'boolean' ], values: [ true ], path: '.prop8[3]', pathTemplate: '.prop8[]' },
            { types: [ 'null' ], values: [ null ], path: '.prop8[4]', pathTemplate: '.prop8[]' },
            { types: [ 'array' ], values: [], children: [], path: '.prop8[5]', pathTemplate: '.prop8[]' },
            { types: [ 'object' ], values: [], children: [], path: '.prop8[6]', pathTemplate: '.prop8[]' },
          ],
        },
        {
          types: [ 'object' ],
          prop: 'prop9',
          values: [],
          path: '.prop9',
          pathTemplate: '.prop9',
          children: [
            {
              types: [ 'string' ],
              prop: 'subprop1',
              values: [ 'val1' ],
              path: '.prop9.subprop1',
              pathTemplate: '.prop9.subprop1',
            },
            {
              types: [ 'number' ],
              prop: 'subprop2',
              values: [ 234 ],
              path: '.prop9.subprop2',
              pathTemplate: '.prop9.subprop2',
            },
            {
              types: [ 'number' ],
              prop: 'subprop3',
              values: [ 234.345 ],
              path: '.prop9.subprop3',
              pathTemplate: '.prop9.subprop3',
            },
            {
              types: [ 'boolean' ],
              prop: 'subprop4',
              values: [ true ],
              path: '.prop9.subprop4',
              pathTemplate: '.prop9.subprop4',
            },
            {
              types: [ 'null' ],
              prop: 'subprop5',
              values: [ null ],
              path: '.prop9.subprop5',
              pathTemplate: '.prop9.subprop5',
            },
            {
              types: [ 'array' ],
              prop: 'subprop6',
              values: [],
              children: [], path: '.prop9.subprop6',
              pathTemplate: '.prop9.subprop6',
            },
            {
              types: [ 'object' ],
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
      types: [ 'array' ],
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { types: [ 'string' ], values: [ 'item1' ], path: '[0]', pathTemplate: '[]' },
        { types: [ 'string' ], values: [ 'item2' ], path: '[1]', pathTemplate: '[]' },
        { types: [ 'string' ], values: [ 'item3' ], path: '[2]', pathTemplate: '[]' },
      ],
    });
  });

  it('mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();
    expect(compact(chartItem)).to.deep.equals({
      types: [ 'array' ],
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { types: [ 'null' ], values: [ null ], path: '[0]', pathTemplate: '[]' },
        { types: [ 'number' ], values: [ 123 ], path: '[1]', pathTemplate: '[]' },
        { types: [ 'number' ], values: [ 123.456 ], path: '[2]', pathTemplate: '[]' },
        { types: [ 'boolean' ], values: [ true ], path: '[3]', pathTemplate: '[]' },
        { types: [ 'string' ], values: [ 'some string' ], path: '[4]', pathTemplate: '[]' },
        { types: [ 'array' ], values: [], children: [], path: '[5]', pathTemplate: '[]' },
        { types: [ 'object' ], values: [], children: [], path: '[6]', pathTemplate: '[]' },
      ],
    });
  });

  it('simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content);
    const chartItem = res[0].getChartItem();

    expect(compact(chartItem)).to.deep.equals({
      types: [ 'object' ],
      values: [],
      path: '',
      pathTemplate: '',
      children: [
        { prop: 'someProp', types: [ 'string' ], values: [ 'val' ], path: '.someProp', pathTemplate: '.someProp' },
        {
          prop: 'somePropWithComment',
          types: [ 'string' ],
          values: [ 'val' ],
          comment: 'comment!!!',
          path: '.somePropWithComment',
          pathTemplate: '.somePropWithComment',
        },
        {
          prop: 'items',
          types: [ 'array' ],
          values: [],
          comment: 'schema: ref(ItemArray)',
          path: '.items',
          pathTemplate: '.items',
          options: [{
            args: [ 'ItemArray' ],
            name: 'ref',
          }],
          children: [{
            types: [ 'object' ],
            values: [],
            path: '.items[0]',
            pathTemplate: '.items[]',
            children: [
              {
                prop: 'name',
                types: [ 'string' ],
                values: [ 'test name' ],
                comment: 'begin of array',
                path: '.items[0].name',
                pathTemplate: '.items[].name',
              },
              {
                prop: 'value',
                types: [ 'string' ],
                values: [ 'test value' ],
                comment: 'some comment #1',
                path: '.items[0].value',
                pathTemplate: '.items[].value',
              },
              {
                prop: 'description',
                types: [ 'string' ],
                values: [ 'test description' ],
                path: '.items[0].description',
                pathTemplate: '.items[].description',
              },
            ],
          }],
        },
        {
          prop: 'elements',
          types: [ 'array' ],
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
              types: [ 'string' ],
              values: [ 'element#1' ],
              comment: 'some comment #2',
              path: '.elements[0]',
              pathTemplate: '.elements[]',
            },
            { types: [ 'string' ], values: [ 'element#2' ], path: '.elements[1]', pathTemplate: '.elements[]' },
            { types: [ 'string' ], values: [ 'element#3' ], path: '.elements[2]', pathTemplate: '.elements[]' },
          ],
        },
        {
          prop: 'props',
          comment: 'some props',
          path: '.props',
          pathTemplate: '.props',
          children: [{
            prop: 'p1',
            types: [ 'string' ],
            values: [ 'val1' ],
            path: '.props.p1',
            pathTemplate: '.props.p1',
          },
          {
            prop: 'p2',
            types: [ 'string' ],
            values: [ 'val2' ],
            path: '.props.p2',
            pathTemplate: '.props.p2',
          },
          {
            prop: 'p3',
            types: [ 'string' ],
            values: [ 'val3' ],
            path: '.props.p3',
            pathTemplate: '.props.p3',
          }],
          types: [ 'object' ],
          values: [],
        },
      ],
    });
  });
});
