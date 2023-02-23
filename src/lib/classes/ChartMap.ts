/* eslint-disable no-useless-constructor */

import {
  Pair,
  YAMLMap,
} from 'yaml';

import { IChartItem, IChartItemGenerator } from './interfaces';
import { ChartPair } from './ChartPair';

export class ChartMap implements IChartItemGenerator {
  constructor(
    private doc: YAMLMap,
  ) { }

  public getChartItem(): IChartItem {
    const chartPart: IChartItem = {
      types: [ 'object' ],
      values: [],
      children: [],
      ...(this.doc.commentBefore && { comment: this.doc.commentBefore.trim().split('\n')[0] }),
    };

    for (const item of this.doc.items) {
      if (item instanceof Pair) {
        chartPart.children!.push(new ChartPair(item).getChartItem());
        continue;
      }

      console.log('ChartMap.getChartItem->item', item);
      throw new Error('Unsupported type');
    }

    return chartPart;
  }
}
