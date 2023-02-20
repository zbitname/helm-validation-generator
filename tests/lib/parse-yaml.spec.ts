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
            type: 'object',
            value: [],
            children: [
                {
                    type: 'string',
                    prop: 'prop1',
                    value: 'some string',
                },
                {
                    type: 'number',
                    prop: 'prop2',
                    value: 123,
                },
                {
                    type: 'number',
                    prop: 'prop3',
                    value: 123.456,
                },
                {
                    type: 'boolean',
                    prop: 'prop4',
                    value: true,
                },
                {
                    type: 'null',
                    prop: 'prop5',
                    value: null,
                },
                {
                    type: 'array',
                    value: [],
                    children: [],
                },
                {
                    type: 'object',
                    value: [],
                    children: [],
                },
                {
                    type: 'array',
                    value: [],
                    children: [
                        {
                            type: 'string',
                            value: 'val1',
                        },
                        {
                            type: 'number',
                            value: 234,
                        },
                        {
                            type: 'number',
                            value: 234.345,
                        },
                        {
                            type: 'boolean',
                            value: true,
                        },
                        {
                            type: 'null',
                            value: null,
                        },
                        {
                            type: 'array',
                            value: [],
                            children: [],
                        },
                        {
                            type: 'object',
                            value: [],
                            children: [],
                        },
                    ],
                },
                {
                    type: 'object',
                    value: [],
                    children: [
                        {
                            type: 'string',
                            prop: 'subprop1',
                            value: 'val1',
                        },
                        {
                            type: 'number',
                            prop: 'subprop2',
                            value: 234,
                        },
                        {
                            type: 'number',
                            prop: 'subprop3',
                            value: 234.345,
                        },
                        {
                            type: 'boolean',
                            prop: 'subprop4',
                            value: true,
                        },
                        {
                            type: 'null',
                            prop: 'subprop5',
                            value: null,
                        },
                        {
                            type: 'array',
                            value: [],
                            children: [],
                        },
                        {
                            type: 'object',
                            value: [],
                            children: [],
                        },
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
            type: 'array',
            value: [],
            children: [
                {
                    type: 'string',
                    value: 'item1',
                },
                {
                    type: 'string',
                    value: 'item2',
                },
                {
                    type: 'string',
                    value: 'item3',
                },
            ],
        });
    });

    it('mixed types in root array items', () => {
        const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
        const res = parse(content, '');
        console.log(res[0].getChartItem());
    });
});
