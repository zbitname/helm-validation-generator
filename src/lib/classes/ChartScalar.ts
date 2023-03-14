/* eslint-disable no-useless-constructor */

import {
  Scalar,
} from 'yaml';

import { getTypeByValue } from './helpers';
import { ChartItem } from './ChartItem';
import { ChartItemGenerator, IChartItemGeneratorParams } from './ChartItemGenerator';

export class ChartScalar extends ChartItemGenerator<Scalar> {
  constructor(
    doc: Scalar,
    params: IChartItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getChartItem(): ChartItem {
    return new ChartItem({
      type: getTypeByValue(this.doc.value),
      values: [ this.doc.value ],
      path: this.path,
      ...(this.doc.comment && { comment: this.doc.comment.trim() }),
    });
  }
}
