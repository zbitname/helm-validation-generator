/* eslint-disable no-useless-constructor */

import {
  Pair,
  YAMLMap,
} from 'yaml';

import { IChartItem } from '../interfaces';
import { ChartPair } from './ChartPair';
import { ChartItem } from './ChartItem';
import { ChartItemGenerator, IChartItemGeneratorParams } from './ChartItemGenerator';

export class ChartMap extends ChartItemGenerator<YAMLMap> {
  constructor(
    doc: YAMLMap,
    params: IChartItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getChartItem(): ChartItem {
    const chartPart: IChartItem = {
      types: [ 'object' ],
      values: [],
      children: [],
      path: this.path,
      ...(this.propName && {
        prop: this.propName,
        path: `${this.path}`,
      }),
      ...(this.doc.commentBefore && { comment: this.doc.commentBefore.trim().split('\n')[0] }),
    };

    for (let i = 0; i < this.doc.items.length; i++) {
      const item = this.doc.items[i];

      if (item instanceof Pair) {
        chartPart.children!.push(new ChartPair(item, {
          // path: `${this.path}[${i}]`,
          path: this.path,
        }).getChartItem());
        continue;
      }

      console.log('ChartMap.getChartItem->item', item);
      throw new Error('Unsupported type');
    }

    return new ChartItem(chartPart);
  }
}
