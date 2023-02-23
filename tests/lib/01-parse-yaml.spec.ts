/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { parse } from '../../src/lib/yaml-to-schema';
import { expect } from 'chai';

describe('YAML parse', () => {
  it('empty input', () => {
    const content = '';
    const res = parse(content, '');
    expect(res).to.be.deep.equals([]);
  });

  it('root based properties with all types', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const res = parse(content, '');
    const chartItem = res[0].getChartItem();

    expect(chartItem).to.deep.equals({
      types: [ 'object' ],
      values: [],
      children: [
        { types: [ 'string' ], prop: 'prop1', values: [ 'some string' ] },
        { types: [ 'number' ], prop: 'prop2', values: [ 123 ] },
        { types: [ 'number' ], prop: 'prop3', values: [ 123.456 ] },
        { types: [ 'boolean' ], prop: 'prop4', values: [ true ] },
        { types: [ 'null' ], prop: 'prop5', values: [ null ] },
        { types: [ 'array' ], prop: 'prop6', values: [], children: [] },
        { types: [ 'object' ], prop: 'prop7', values: [], children: [] },
        {
          types: [ 'array' ],
          prop: 'prop8',
          values: [],
          children: [
            { types: [ 'string' ], values: [ 'val1' ] },
            { types: [ 'number' ], values: [ 234 ] },
            { types: [ 'number' ], values: [ 234.345 ] },
            { types: [ 'boolean' ], values: [ true ] },
            { types: [ 'null' ], values: [ null ] },
            { types: [ 'array' ], values: [], children: [] },
            { types: [ 'object' ], values: [], children: [] },
          ],
        },
        {
          types: [ 'object' ],
          prop: 'prop9',
          values: [],
          children: [
            { types: [ 'string' ], prop: 'subprop1', values: [ 'val1' ] },
            { types: [ 'number' ], prop: 'subprop2', values: [ 234 ] },
            { types: [ 'number' ], prop: 'subprop3', values: [ 234.345 ] },
            { types: [ 'boolean' ], prop: 'subprop4', values: [ true ] },
            { types: [ 'null' ], prop: 'subprop5', values: [ null ] },
            { types: [ 'array' ], prop: 'subprop6', values: [], children: [] },
            { types: [ 'object' ], prop: 'subprop7', values: [], children: [] },
          ],
        },
      ],
    });
  });

  it('root based array', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const res = parse(content, '');
    const chartItem = res[0].getChartItem();
    expect(chartItem).to.deep.equals({
      types: [ 'array' ],
      values: [],
      children: [
        { types: [ 'string' ], values: [ 'item1' ] },
        { types: [ 'string' ], values: [ 'item2' ] },
        { types: [ 'string' ], values: [ 'item3' ] },
      ],
    });
  });

  it('mixed types in root array items', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content, '');
    const chartItem = res[0].getChartItem();
    expect(chartItem).to.deep.equals({
      types: [ 'array' ],
      values: [],
      children: [
        { types: [ 'null' ], values: [ null ] },
        { types: [ 'number' ], values: [ 123 ] },
        { types: [ 'number' ], values: [ 123.456 ] },
        { types: [ 'boolean' ], values: [ true ] },
        { types: [ 'string' ], values: [ 'some string' ] },
        { types: [ 'array' ], values: [], children: [] },
        { types: [ 'object' ], values: [], children: [] },
      ],
    });
  });

  it('simple case with comments', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content, '');
    const chartItem = res[0].getChartItem();

    expect(chartItem).to.deep.equals({
      types: [ 'object' ],
      values: [],
      children: [
        { prop: 'someProp', types: [ 'string' ], values: [ 'val' ] },
        {
          prop: 'somePropWithComment',
          types: [ 'string' ],
          values: [ 'val' ],
          comment: 'comment!!!',
        },
        {
          prop: 'items',
          types: [ 'array' ],
          values: [],
          comment: 'json-schema: ref=ItemArray',
          children: [
            {
              types: [ 'object' ],
              values: [],
              children: [
                {
                  prop: 'name',
                  types: [ 'string' ],
                  values: [ 'test name' ],
                  comment: 'begin of array',
                },
                {
                  prop: 'value',
                  types: [ 'string' ],
                  values: [ 'test value' ],
                  comment: 'some comment #1',
                },
                { prop: 'description', types: [ 'string' ], values: [ 'test description' ] },
              ],
            },
          ],
        },
        {
          prop: 'elements',
          types: [ 'array' ],
          values: [],
          comment: 'json-schema: ref=Elements',
          children: [
            { types: [ 'string' ], values: [ 'element#1' ], comment: 'some comment #2' },
            { types: [ 'string' ], values: [ 'element#2' ] },
            { types: [ 'string' ], values: [ 'element#3' ] },
          ],
        },
        {
          prop: 'props',
          comment: 'some props',
          children: [
            {
              prop: 'p1',
              types: [ 'string' ],
              values: [ 'val1' ],
            },
            {
              prop: 'p2',
              types: [ 'string' ],
              values: [ 'val2' ],
            },
            {
              prop: 'p3',
              types: [ 'string' ],
              values: [ 'val3' ],
            },
          ],
          types: [ 'object' ],
          values: [],
        },
      ],
    });
  });
});
