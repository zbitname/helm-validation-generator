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
      type: 'object',
      value: [],
      children: [],
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
