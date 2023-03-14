/* eslint-disable no-useless-constructor */

import {
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { IChartItem } from '../interfaces';
import { ChartScalar } from './ChartScalar';
import { ChartMap } from './ChartMap';
import { ChartItem } from './ChartItem';
import { ChartItemGenerator, IChartItemGeneratorParams } from './ChartItemGenerator';

export class ChartSeq extends ChartItemGenerator<YAMLSeq> {
  constructor(
    doc: YAMLSeq,
    params: IChartItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getChartItem(): ChartItem {
    const chartPart: IChartItem = {
      type: 'array',
      values: [],
      children: [],
      path: this.path,
      ...(this.propName && {
        prop: this.propName,
      }),
    };

    if (this.doc.commentBefore) {
      chartPart.comment = this.doc.commentBefore.trim().split('\n')[0];
    }

    for (let i = 0; i < this.doc.items.length; i++) {
      const item = this.doc.items[i];

      if (item instanceof Scalar) {
        chartPart.children!.push(new ChartScalar(item, {
          path: `${this.path}[${i}]`,
        }).getChartItem());
        continue;
      }

      if (item instanceof YAMLSeq) {
        chartPart.children!.push(new ChartSeq(item, {
          path: `${this.path}[${i}]`,
        }).getChartItem());
        continue;
      }

      if (item instanceof YAMLMap) {
        chartPart.children!.push(new ChartMap(item, {
          path: `${this.path}[${i}]`,
        }).getChartItem());
        continue;
      }

      console.log('ChartSeq.getChartItem->item', item);
      throw new Error('Unsupported type');
    }

    return new ChartItem(chartPart);
  }
}
