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
      children: [
        { types: [ 'string' ], prop: 'prop1', values: [ 'some string' ], path: '.prop1' },
        { types: [ 'number' ], prop: 'prop2', values: [ 123 ], path: '.prop2' },
        { types: [ 'number' ], prop: 'prop3', values: [ 123.456 ], path: '.prop3' },
        { types: [ 'boolean' ], prop: 'prop4', values: [ true ], path: '.prop4' },
        { types: [ 'null' ], prop: 'prop5', values: [ null ], path: '.prop5' },
        { types: [ 'array' ], prop: 'prop6', values: [], children: [], path: '.prop6' },
        { types: [ 'object' ], prop: 'prop7', values: [], children: [], path: '.prop7' },
        {
          types: [ 'array' ],
          prop: 'prop8',
          values: [],
          path: '.prop8',
          children: [
            { types: [ 'string' ], values: [ 'val1' ], path: '.prop8[0]' },
            { types: [ 'number' ], values: [ 234 ], path: '.prop8[1]' },
            { types: [ 'number' ], values: [ 234.345 ], path: '.prop8[2]' },
            { types: [ 'boolean' ], values: [ true ], path: '.prop8[3]' },
            { types: [ 'null' ], values: [ null ], path: '.prop8[4]' },
            { types: [ 'array' ], values: [], children: [], path: '.prop8[5]' },
            { types: [ 'object' ], values: [], children: [], path: '.prop8[6]' },
          ],
        },
        {
          types: [ 'object' ],
          prop: 'prop9',
          values: [],
          path: '.prop9',
          children: [
            { types: [ 'string' ], prop: 'subprop1', values: [ 'val1' ], path: '.prop9.subprop1' },
            { types: [ 'number' ], prop: 'subprop2', values: [ 234 ], path: '.prop9.subprop2' },
            { types: [ 'number' ], prop: 'subprop3', values: [ 234.345 ], path: '.prop9.subprop3' },
            { types: [ 'boolean' ], prop: 'subprop4', values: [ true ], path: '.prop9.subprop4' },
            { types: [ 'null' ], prop: 'subprop5', values: [ null ], path: '.prop9.subprop5' },
            { types: [ 'array' ], prop: 'subprop6', values: [], children: [], path: '.prop9.subprop6' },
            { types: [ 'object' ], prop: 'subprop7', values: [], children: [], path: '.prop9.subprop7' },
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
      children: [
        { types: [ 'string' ], values: [ 'item1' ], path: '[0]' },
        { types: [ 'string' ], values: [ 'item2' ], path: '[1]' },
        { types: [ 'string' ], values: [ 'item3' ], path: '[2]' },
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
      children: [
        { types: [ 'null' ], values: [ null ], path: '[0]' },
        { types: [ 'number' ], values: [ 123 ], path: '[1]' },
        { types: [ 'number' ], values: [ 123.456 ], path: '[2]' },
        { types: [ 'boolean' ], values: [ true ], path: '[3]' },
        { types: [ 'string' ], values: [ 'some string' ], path: '[4]' },
        { types: [ 'array' ], values: [], children: [], path: '[5]' },
        { types: [ 'object' ], values: [], children: [], path: '[6]' },
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
      children: [
        { prop: 'someProp', types: [ 'string' ], values: [ 'val' ], path: '.someProp' },
        {
          prop: 'somePropWithComment',
          types: [ 'string' ],
          values: [ 'val' ],
          comment: 'comment!!!',
          path: '.somePropWithComment',
        },
        {
          prop: 'items',
          types: [ 'array' ],
          values: [],
          comment: 'schema: ref(ItemArray)',
          path: '.items',
          options: [{
            args: [ 'ItemArray' ],
            name: 'ref',
          }],
          children: [{
            types: [ 'object' ],
            values: [],
            path: '.items[0]',
            children: [
              {
                prop: 'name',
                types: [ 'string' ],
                values: [ 'test name' ],
                comment: 'begin of array',
                path: '.items[0].name',
              },
              {
                prop: 'value',
                types: [ 'string' ],
                values: [ 'test value' ],
                comment: 'some comment #1',
                path: '.items[0].value',
              },
              {
                prop: 'description',
                types: [ 'string' ],
                values: [ 'test description' ],
                path: '.items[0].description',
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
            },
            { types: [ 'string' ], values: [ 'element#2' ], path: '.elements[1]' },
            { types: [ 'string' ], values: [ 'element#3' ], path: '.elements[2]' },
          ],
        },
        {
          prop: 'props',
          comment: 'some props',
          path: '.props',
          children: [{
            prop: 'p1',
            types: [ 'string' ],
            values: [ 'val1' ],
            path: '.props.p1',
          },
          {
            prop: 'p2',
            types: [ 'string' ],
            values: [ 'val2' ],
            path: '.props.p2',
          },
          {
            prop: 'p3',
            types: [ 'string' ],
            values: [ 'val3' ],
            path: '.props.p3',
          }],
          types: [ 'object' ],
          values: [],
        },
      ],
    });
  });
});
