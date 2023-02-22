/* eslint-disable no-useless-constructor */

import {
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { IChartItem, IChartItemGenerator } from './interfaces';
import { ChartScalar } from './ChartScalar';
import { ChartMap } from './ChartMap';

export class ChartSeq implements IChartItemGenerator {
  constructor(
    private doc: YAMLSeq,
  ) { }

  public getChartItem(): IChartItem {
    const chartPart: IChartItem = {
      type: 'array',
      value: [],
      children: [],
    };

    if (this.doc.commentBefore) {
      chartPart.comment = this.doc.commentBefore.trim().split('\n')[0];
    }

    for (const item of this.doc.items) {
      if (item instanceof Scalar) {
        chartPart.children!.push(new ChartScalar(item).getChartItem());
        continue;
      }

      if (item instanceof YAMLSeq) {
        chartPart.children!.push(new ChartSeq(item).getChartItem());
        continue;
      }

      if (item instanceof YAMLMap) {
        chartPart.children!.push(new ChartMap(item).getChartItem());
        continue;
      }

      console.log('ChartSeq.getChartItem->item', item);
      throw new Error('Unsupported type');
    }

    return chartPart;
  }
}
