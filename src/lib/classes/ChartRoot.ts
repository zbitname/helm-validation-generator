/* eslint-disable no-useless-constructor */

import {
  Document,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { ChartSeq } from './ChartSeq';
import { ChartMap } from './ChartMap';
import { ChartItem } from './ChartItem';
import { ChartItemGenerator } from './ChartItemGenerator';

export class ChartRoot extends ChartItemGenerator<Document> {
  constructor(
    doc: Document,
  ) {
    super(doc);
  }

  public getChartItem(): ChartItem {
    if (this.doc.contents instanceof YAMLSeq) {
      return new ChartSeq(this.doc.contents, {
        path: ''
      }).getChartItem();
    }

    if (this.doc.contents instanceof YAMLMap) {
      return new ChartMap(this.doc.contents, {
        path: ''
      }).getChartItem();
    }

    throw new Error('Unsupported type');
  }
}
