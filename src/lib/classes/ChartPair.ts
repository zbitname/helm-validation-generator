/* eslint-disable no-useless-constructor */

import {
  Pair,
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { ChartMap } from './ChartMap';
import { ChartSeq } from './ChartSeq';
import { getTypeByValue } from './helpers';
import { ChartItem } from './ChartItem';
import { ChartItemGenerator, IChartItemGeneratorParams } from './ChartItemGenerator';

const buildPathKey = (key: string) => {
  let k = key;
  if (k === null) {
    k = 'null';
  }
  return k.replace(/\./g, '\\.');
};

export class ChartPair extends ChartItemGenerator<Pair> {
  constructor(
    doc: Pair,
    params: IChartItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getChartItem(): ChartItem {
    if (!(this.doc.key instanceof Scalar)) {
      console.debug('failed pair', this.doc);
      throw new Error('Key must be Scalar type');
    }

    if (this.doc.value instanceof Scalar) {
      const path = `${this.path}.${buildPathKey(this.doc.key.value)}`;

      return new ChartItem({
        prop: this.doc.key.value,
        type: getTypeByValue(this.doc.value?.value),
        values: [ this.doc.value.value ],
        path,
        ...(this.doc.value.comment && { comment: this.doc.value.comment?.trim() }),
      });
    }

    if (this.doc.value instanceof Pair) {
      return new ChartPair(this.doc.value, {
        path: this.path,
      }).getChartItem();
    }

    if (this.doc.value instanceof YAMLMap) {
      return new ChartMap(this.doc.value, {
        propName: this.doc.key.value,
        path: `${this.path}.${buildPathKey(this.doc.key.value)}`,
      }).getChartItem();
    }

    if (this.doc.value instanceof YAMLSeq) {
      return new ChartSeq(this.doc.value, {
        propName: this.doc.key.value,
        path: `${this.path}.${buildPathKey(this.doc.key.value)}`,
      }).getChartItem();
    }

    console.log('ChartPair.getChartItem->(this.doc.value)', this.doc.value);
    throw new Error('Unsupported type');
  }
}
