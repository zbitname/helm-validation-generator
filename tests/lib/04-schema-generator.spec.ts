/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../../src/lib/parse-yaml';
import { flatten } from '../../src/lib/flatten';
import { operationFiller } from '../../src/lib/operation-filler';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { SkipControlComment } from '../../src/lib/control-comments/skip';
import { RefControlComment } from '../../src/lib/control-comments/ref';
import { getJSONSchemaFromFlat } from '../../src/lib/flat-shema-generator';
import { omit } from 'lodash';

describe('Get JSON schema from flat', () => {
  const controlCommentRepo = new ControlCommentRepo();
  controlCommentRepo.add('skip', SkipControlComment);
  controlCommentRepo.add('ref', RefControlComment);

  it('file=1-lvl-array-with-scalars-twice.yaml', () => {
    const content = readFileSync(`${__dirname}/files/1-lvl-array-with-scalars-twice.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'boolean', pathTemplate: '[]' },
      { type: 'string', pathTemplate: '[]' },
      { type: 'number', pathTemplate: '[]' },
      { type: 'null', pathTemplate: '[]' },
    ]);
  });

  it('file=different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'object', properties: [], required: [], pathTemplate: '.prop1' },
      { type: 'array', items: [], pathTemplate: '.prop1.arr' },
      { type: 'number', pathTemplate: '.prop1.arr[]' },
      { type: 'string', pathTemplate: '.prop1.arr[]' },
      { type: 'boolean', pathTemplate: '.prop1.arr[]' },
      { type: 'null', pathTemplate: '.prop1.arr[]' },
      { type: 'boolean', pathTemplate: '.prop1.bool' },
      { type: 'null', pathTemplate: '.prop1.null' },
      { type: 'number', pathTemplate: '.prop1.num' },
      { type: 'object', properties: [], required: [], pathTemplate: '.prop1.obj' },
      { type: 'boolean', pathTemplate: '.prop1.obj.subbool' },
      { type: 'null', pathTemplate: '.prop1.obj.subnull' },
      { type: 'number', pathTemplate: '.prop1.obj.subnum' },
      { type: 'string', pathTemplate: '.prop1.obj.substr' },
      { type: 'string', pathTemplate: '.prop1.str' },
    ]);
  });

  it('file=mixed-types-root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/mixed-types-root-array.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'null', pathTemplate: '[]' },
      { type: 'number', pathTemplate: '[]' },
      { type: 'boolean', pathTemplate: '[]' },
      { type: 'string', pathTemplate: '[]' },
      { type: 'array', items: [], pathTemplate: '[]' },
      { type: 'object', properties: [], required: [], pathTemplate: '[]' },
    ]);
  });

  it('file=prop.yaml', () => {
    const content = readFileSync(`${__dirname}/files/prop.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'string', pathTemplate: '.prop1' },
      { type: 'number', pathTemplate: '.prop2' },
      { type: 'number', pathTemplate: '.prop3' },
      { type: 'boolean', pathTemplate: '.prop4' },
      { type: 'null', pathTemplate: '.prop5' },
      { type: 'array', items: [], pathTemplate: '.prop6' },
      { type: 'object', properties: [], required: [], pathTemplate: '.prop7' },
      { type: 'array', items: [], pathTemplate: '.prop8' },
      { type: 'string', pathTemplate: '.prop8[]' },
      { type: 'number', pathTemplate: '.prop8[]' },
      { type: 'boolean', pathTemplate: '.prop8[]' },
      { type: 'null', pathTemplate: '.prop8[]' },
      { type: 'array', items: [], pathTemplate: '.prop8[]' },
      { type: 'object', properties: [], required: [], pathTemplate: '.prop8[]' },
      { type: 'object', properties: [], required: [], pathTemplate: '.prop9' },
      { type: 'string', pathTemplate: '.prop9.subprop1' },
      { type: 'number', pathTemplate: '.prop9.subprop2' },
      { type: 'number', pathTemplate: '.prop9.subprop3' },
      { type: 'boolean', pathTemplate: '.prop9.subprop4' },
      { type: 'null', pathTemplate: '.prop9.subprop5' },
      { type: 'array', items: [], pathTemplate: '.prop9.subprop6' },
      { type: 'object', properties: [], required: [], pathTemplate: '.prop9.subprop7' },
    ]);
  });

  it('file=root-array.yaml', () => {
    const content = readFileSync(`${__dirname}/files/root-array.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      {
        type: 'string',
        pathTemplate: '[]',
      }
    ]);
  });

  it('file=simple-comments.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-comments.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'array', items: [], pathTemplate: '.elements' },
      { type: 'string', pathTemplate: '.elements[]' },
      { type: 'array', items: [], pathTemplate: '.items' },
      { type: 'object', properties: [], required: [], pathTemplate: '.items[]' },
      { type: 'string', pathTemplate: '.items[].description' },
      { type: 'string', pathTemplate: '.items[].name' },
      { type: 'string', pathTemplate: '.items[].value' },
      { type: 'object', properties: [], required: [], pathTemplate: '.props' },
      { type: 'string', pathTemplate: '.props.p1' },
      { type: 'string', pathTemplate: '.props.p2' },
      { type: 'string', pathTemplate: '.props.p3' },
      { type: 'string', pathTemplate: '.someProp' },
      { type: 'string', pathTemplate: '.somePropWithComment' },
    ]);
  });

  it('file=simple-schema-1.yaml', () => {
    const content = readFileSync(`${__dirname}/files/simple-schema-1.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = operationFiller(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);

    for (const schemaItem of schema) {
      expect(schemaItem).to.have.property('chartItems');
    }

    expect(schema.map((i) => omit(i, ['chartItems']))).to.deep.equals([
      { type: 'object', properties: [], required: [], pathTemplate: '.model1' },
      { type: 'string', pathTemplate: '.model1.name' },
      { type: 'string', pathTemplate: '.model1.value' },
      { type: 'object', properties: [], required: [], pathTemplate: '.someModel' },
      { type: 'string', pathTemplate: '.someModel.comment' },
      { type: 'string', pathTemplate: '.someModel.name' },
      { type: 'string', pathTemplate: '.someModel.value' },
    ]);
  });
});
