/* eslint-disable no-useless-constructor */

import {
  Scalar,
} from 'yaml';

import { IChartItem, IChartItemGenerator } from './interfaces';
import { getTypeByValue } from './helpers';

export class ChartScalar implements IChartItemGenerator {
  constructor(
    private doc: Scalar,
  ) { }

  public getChartItem(): IChartItem {
    return {
      types: [ getTypeByValue(this.doc.value) ],
      values: [ this.doc.value ],
      ...(this.doc.comment && { comment: this.doc.comment.trim() }),
    };
  }
}
